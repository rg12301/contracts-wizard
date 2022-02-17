import { Contract, ContractBuilder } from './contract';
import { Access, setAccessControl } from './set-access-control';
// import { addPausable } from './add-pausable';
import { defineFunctions } from './utils/define-functions';
import { CommonOptions, withCommonDefaults, withImplicitArgs } from './common-options';
import { setUpgradeable } from './set-upgradeable';
import { setInfo } from './set-info';

export interface ERC20Options extends CommonOptions {
  name: string;
  symbol: string;
  burnable?: boolean;
  snapshots?: boolean;
  pausable?: boolean;
  premint?: string;
  mintable?: boolean;
  permit?: boolean;
  votes?: boolean;
  flashmint?: boolean;
}

export function buildERC20(opts: ERC20Options): Contract {
  const c = new ContractBuilder(opts.name);
  c.addConstructorArgument({ name:'initial_supply', type:'Uint256' });
  c.addConstructorArgument({ name:'recipient', type:'felt' });

  const { access, upgradeable, info } = withCommonDefaults(opts);

  addBase(c, opts.name, opts.symbol);

  // if (opts.burnable) {
  //   addBurnable(c);
  // }

  // if (opts.snapshots) {
  //   addSnapshot(c, access);
  // }

  // if (opts.pausable) {
  //   addPausable(c, access, [functions._beforeTokenTransfer]);
  // }

  // if (opts.premint) {
  //   addPremint(c, opts.premint);
  // }

  if (opts.mintable) {
    addMintable(c, access);
  }

  // // Note: Votes requires Permit
  // if (opts.permit || opts.votes) {
  //   addPermit(c, opts.name);
  // }

  // if (opts.votes) {
  //   addVotes(c);
  // }

  // if (opts.flashmint) {
  //   addFlashMint(c);
  // }

  setUpgradeable(c, upgradeable, access);
  
  setInfo(c, info);

  return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {
  c.addParent(
    {
      name: 'ERC20',
      path: 'contracts/token/ERC20_base',
    },
    [name, symbol, { lit:'initial_supply' }, { lit:'recipient' }],
  );
}

// function addBurnable(c: ContractBuilder) {
//   c.addParent({
//     name: 'ERC20Burnable',
//     path: 'contracts/token/ERC20/extensions/ERC20Burnable',
//   });
// }

// function addSnapshot(c: ContractBuilder, access: Access) {
//   c.addParent({
//     name: 'ERC20Snapshot',
//     path: 'contracts/token/ERC20/extensions/ERC20Snapshot',
//   });

//   c.addOverride('ERC20Snapshot', functions._beforeTokenTransfer);

//   setAccessControl(c, functions.snapshot, access, 'SNAPSHOT');
//   c.addFunctionCode('_snapshot();', functions.snapshot);
// }

// export const premintPattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;

// function addPremint(c: ContractBuilder, amount: string) {
//   const m = amount.match(premintPattern);
//   if (m) {
//     const integer = m[1]?.replace(/^0+/, '') ?? '';
//     const decimals = m[2]?.replace(/0+$/, '') ?? '';
//     const exponent = Number(m[3] ?? 0);

//     if (Number(integer + decimals) > 0) {
//       const decimalPlace = decimals.length - exponent;
//       const zeroes = new Array(Math.max(0, -decimalPlace)).fill('0').join('');
//       const units = integer + decimals + zeroes;
//       const exp = decimalPlace <= 0 ? 'decimals()' : `(decimals() - ${decimalPlace})`;
//       c.addConstructorCode(`_mint(msg.sender, ${units} * 10 ** ${exp});`);
//     }
//   }
// }

function addMintable(c: ContractBuilder, access: Access) {
  setAccessControl(c, functions.mint, access, 'MINTER');
  //c.addFunctionCode('_mint(to, amount);', functions.mint);
}

// function addPermit(c: ContractBuilder, name: string) {
//   c.addParent({
//     name: 'ERC20Permit',
//     path: 'contracts/token/ERC20/extensions/draft-ERC20Permit',
//   }, [name]);
// }

// function addVotes(c: ContractBuilder) {
//   if (!c.parents.some(p => p.contract.name === 'ERC20Permit')) {
//     throw new Error('Missing ERC20Permit requirement for ERC20Votes');
//   }

//   c.addParent({
//     name: 'ERC20Votes',
//     path: 'contracts/token/ERC20/extensions/ERC20Votes',
//   });
// }

// function addFlashMint(c: ContractBuilder) {
//   c.addParent({
//     name: 'ERC20FlashMint',
//     path: 'contracts/token/ERC20/extensions/ERC20FlashMint',
//   });
// }

const functions = defineFunctions({
  mint: {
    module: 'ERC20',
    kind: 'external' as const,
    implicitArgs: withImplicitArgs(),
    args: [
      { name: 'to', type: 'felt' },
      { name: 'amount', type: 'Uint256' },
    ],
  },

  // pause: {
  //   kind: 'external' as const,
  //   args: [],
  // },

  // unpause: {
  //   kind: 'external' as const,
  //   args: [],
  // },

  // snapshot: {
  //   kind: 'external' as const,
  //   args: [],
  // },
});
