import { withImplicitArgs } from './common-options';
import type { ContractBuilder, BaseFunction } from './contract';
import { Access, setAccessControl } from './set-access-control';
import { defineFunctions } from './utils/define-functions';

export function addPausable(c: ContractBuilder, access: Access, pausableFns: BaseFunction[]) {
  c.addParent({
    name: 'Pausable',
    path: 'contracts/security/Pausable_base',
  });

  for (const fn of pausableFns) {
    // TODO add these base functions to parent imports
    c.addModifier('Pausable_when_not_paused()', fn);
  }

  setAccessControl(c, functions.pause, access, 'PAUSER');

  setAccessControl(c, functions.unpause, access, 'PAUSER');
}

const functions = defineFunctions({
  pause: {
    module: 'Pausable',
    kind: 'external' as const,
    implicitArgs: withImplicitArgs(),
    args: [],
  },

  unpause: {
    module: 'Pausable',
    kind: 'external' as const,
    implicitArgs: withImplicitArgs(),
    args: [],
  },
  // pause: {
  //   kind: 'external' as const,
  //   args: [],
  // },

  // unpause: {
  //   kind: 'external' as const,
  //   args: [],
  // },
});
