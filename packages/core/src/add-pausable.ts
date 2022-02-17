// import type { ContractBuilder, BaseFunction } from './contract';
// import { Access, setAccessControl } from './set-access-control';
// import { defineFunctions } from './utils/define-functions';

export {};

// export function addPausable(c: ContractBuilder, access: Access, pausableFns: BaseFunction[]) {
//   c.addParent({
//     name: 'Pausable',
//     path: 'openzeppelin/contracts/security/Pausable',
//   });

//   for (const fn of pausableFns) {
//     c.addModifier('whenNotPaused', fn);
//   }

//   setAccessControl(c, functions.pause, access, 'PAUSER');
//   c.addFunctionCode('_pause();', functions.pause);

//   setAccessControl(c, functions.unpause, access, 'PAUSER');
//   c.addFunctionCode('_unpause();', functions.unpause);
// }

// const functions = defineFunctions({
//   pause: {
//     kind: 'external' as const,
//     args: [],
//   },

//   unpause: {
//     kind: 'external' as const,
//     args: [],
//   },
// });
