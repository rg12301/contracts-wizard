import 'array.prototype.flatmap/auto';

import type { Contract, Parent, ContractFunction, FunctionArgument, Value, NatspecTag } from './contract';
import { Options, Helpers, withHelpers } from './options';

import { formatLines, spaceBetween, Lines } from './utils/format-lines';
import { mapValues } from './utils/map-values';

export function printContract(contract: Contract, opts?: Options): string {
  const helpers = withHelpers(contract, opts);

  const fns = mapValues(
    sortedFunctions(contract),
    fns => fns.map(fn => printFunction(fn, helpers)),
  );

  const hasOverrides = fns.override.some(l => l.length > 0);

  return formatLines(
    ...spaceBetween(
      [
        // TODO print license ${contract.license}
        `%lang starknet`
      ],

      [
        `from starkware.cairo.common.cairo_builtins import HashBuiltin`,
        `from starkware.cairo.common.uint256 import Uint256`
      ],

      contract.imports.map(p => `from ${helpers.transformImport(p)}`),

      //[
        //...printNatspecTags(contract.natspecTags),
        //[`contract ${contract.name}`, ...printInheritance(contract, helpers), '{'].join(' '),

        spaceBetween(
          printUsingFor(contract, helpers),
          contract.variables.map(helpers.transformVariable),
          printConstructor(contract, helpers),
          ...fns.code,
          ...fns.modifiers,
          hasOverrides ? [`// The following functions are overrides required by Solidity.`] : [],
          ...fns.override,
        ),

        //`}`,
      //],
    ),
  );
}

function printInheritance(contract: Contract, { transformName }: Helpers): [] | [string] {
  if (contract.parents.length > 0) {
    return ['is ' + contract.parents.map(p => transformName(p.contract.name)).join(', ')];
  } else {
    return [];
  }
}

function printUsingFor(contract: Contract, { transformName }: Helpers): string[] {
  return contract.using.map(
    u => `using ${transformName(u.library.name)} for ${transformName(u.usingFor)};`,
  );
}

function printConstructor(contract: Contract, helpers: Helpers): Lines[] {
  const hasParentParams = contract.parents.some(p => p.params.length > 0);
  const hasConstructorCode = contract.constructorCode.length > 0;
  if (hasParentParams || hasConstructorCode) {
    const parents = contract.parents
      .filter(hasInitializer)
      .flatMap(p => printParentConstructor(p, helpers));
    const modifiers = ['constructor'];
    const args = contract.constructorArgs.map(a => printArgument(a, helpers));
    const implicitArgs = contract.constructorImplicitArgs?.map(a => printArgument(a, helpers));
    const body = spaceBetween(
        parents.map(p => p + ';'),
        contract.constructorCode,
      );
    const head = 'func constructor';

    const constructor = printFunction2(
      head,
      implicitArgs ?? [],
      args,
      modifiers,
      undefined,
      undefined,
      body,
    );
    if (!helpers.upgradeable) {
      return constructor;
    } else {
      return spaceBetween(
        [
          '/// @custom:oz-upgrades-unsafe-allow constructor',
          'constructor() initializer {}',
        ],
        constructor,
      );
    }
  } else {
    return [];
  }
}

function hasInitializer(parent: Parent) {
  // CAUTION
  // This list is validated by compilation of SafetyCheck.sol.
  // Always keep this list and that file in sync.
  return !['Initializable', 'ERC20Votes'].includes(parent.contract.name);
}

type SortedFunctions = Record<'code' | 'modifiers' | 'override', ContractFunction[]>;

// Functions with code first, then those with modifiers, then the rest
function sortedFunctions(contract: Contract): SortedFunctions {
  const fns: SortedFunctions = { code: [], modifiers: [], override: [] };

  for (const fn of contract.functions) {
    if (fn.code.length > 0) {
      fns.code.push(fn);
    } else if (fn.modifiers.length > 0) {
      fns.modifiers.push(fn);
    } else {
      fns.override.push(fn);
    }
  }

  return fns;
}

function printParentConstructor({ contract, params }: Parent, helpers: Helpers): [] | [string] {
  const fn = `${contract.name}_initializer`;
  return [
    fn + '(' + params.map(printValue).join(', ') + ')',
  ];
}

export function printValue(value: Value): string {
  if (typeof value === 'object') {
    if ('lit' in value) {
      return value.lit;
    } else if ('note' in value) {
      return `${printValue(value.value)} /* ${value.note} */`;
    } else {
      throw Error('Unknown value type');
    }
  } else if (typeof value === 'number') {
    if (Number.isSafeInteger(value)) {
      return value.toFixed(0);
    } else {
      throw new Error(`Number not representable (${value})`);
    }
  } else {
    return JSON.stringify(value);
  }
}

function printFunction(fn: ContractFunction, helpers: Helpers): Lines[] {
  const { transformName } = helpers;

  // if (fn.override.size <= 1 && fn.modifiers.length === 0 && fn.code.length === 0 && !fn.final) {
  //   return []
  // }

  // const modifiers: string[] = [fn.kind, ...fn.modifiers];

  // if (fn.mutability !== 'nonpayable') {
  //   modifiers.splice(1, 0, fn.mutability);
  // }

  // if (fn.override.size === 1) {
  //   modifiers.push(`override`);
  // } else if (fn.override.size > 1) {
  //   modifiers.push(`override(${[...fn.override].map(transformName).join(', ')})`);
  // }

  // if (fn.returns?.length) {
  //   modifiers.push(`returns (${fn.returns.join(', ')})`);
  // }

  const code = [...fn.code];

  // if (fn.override.size > 0 && !fn.final) {
  //   const superCall = `super.${fn.name}(${fn.args.map(a => a.name).join(', ')});`;
  //   code.push(fn.returns?.length ? 'return ' + superCall : superCall);
  // }

  const superCall = `${fn.module}_${fn.name}(${fn.args.map(a => a.name).join(', ')});`;
  code.push(fn.returns?.length ? 'return ' + superCall : superCall);


  //if (modifiers.length + fn.code.length > 1) {
    return printFunction2(
      'func ' + fn.name,
      fn.implicitArgs?.map(a => printArgument(a, helpers)) ?? [],
      fn.args.map(a => printArgument(a, helpers)),
      [fn.kind ?? "kindNotFound"],
      fn.returns?.map(a => typeof a === 'string' ? a : printArgument(a, helpers)),
      fn.returns?.map(a => typeof a === 'string' ? a : a.name),
      code,
    );
  // } else {
  //   return [];
  // }
}

// generic for functions and constructors
// kindedName = 'function foo' or 'constructor'
function printFunction2(kindedName: string, implicitArgs: string[], args: string[], kind: string[], returns: string[] | undefined, returnVariables: string[] | undefined, code: Lines[]): Lines[] {
  const fn = [];

  //modifiers.forEach(modifier => fn.push(`@${modifier}`));
  fn.push(`@${kind}`);
  fn.push(`${kindedName}{`);

  fn.push([implicitArgs]);
  
  const formattedArgs = args.join(', ');
  const formattedReturns = returns?.join(', ');

  if (returns !== undefined) {
    fn.push([`}(${formattedArgs}) -> (${formattedReturns}):`]);
  } else {
    fn.push([`}(${formattedArgs}):`]);
  }

  // const headingLength = [kindedName, ...args, ...modifiers]
  //   .map(s => s.length)
  //   .reduce((a, b) => a + b);

  // if (headingLength <= 72) {
  //   fn.push([`(${args.join(', ')})`, ...modifiers, ':'].join(' '));
  // } else {
  //   fn.push(`(${args.join(', ')})`, modifiers, ':');
  // }

//  fn.push(`(${args.join(', ')})`, modifiers, ':');

  fn.push(code);

  if (returnVariables !== undefined) {
    const formattedReturnVars = returnVariables?.join(', ');
    fn.push([`return (${formattedReturnVars})`]);
  } else {
    fn.push(['return ()']);
  }

  fn.push('end');

  return fn;
}

function printArgument(arg: FunctionArgument, { transformName }: Helpers): string {
  if (arg.type !== undefined) {
    const type = /^[A-Z]/.test(arg.type) ? transformName(arg.type) : arg.type;
    return `${arg.name}: ${type}`;//[type, arg.name].join(' ');  
  } else {
    return `${arg.name}`;
  }
}

function printNatspecTags(tags: NatspecTag[]): string[] {
  return tags.map(({ key, value }) => `/// ${key} ${value}`);
}
