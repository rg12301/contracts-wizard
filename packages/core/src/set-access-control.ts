import type { ContractBuilder, BaseFunction } from './contract';
// import { supportsInterface } from './common-functions';

export const accessOptions = ['ownable', 'roles'] as const;

export type Access = typeof accessOptions[number];

export function setAccessControl(c: ContractBuilder, fn: BaseFunction, access: Access, role: string) {
  switch (access) {
    case 'ownable': {
      c.addParent(parents.Ownable, [{ lit:'owner' }], ['Ownable_only_owner']);
      c.addModifier('Ownable_only_owner()', fn);
      break;
    }
    case 'roles': {
      const roleId = role + '_ROLE';
      if (c.addParent(parents.AccessControl, [], [])) {
        c.addConstructorCode('_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);');
      }
      // c.addOverride(parents.AccessControl.name, supportsInterface);
      if (c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`)) {
        c.addConstructorCode(`_grantRole(${roleId}, msg.sender);`);
      }
      c.addModifier(`onlyRole(${roleId})`, fn);
      break;
    }
  }
}

const parents = {
  Ownable: {
    name: 'Ownable',
    path: 'contracts/Ownable_base',
  },
  AccessControl: {
    name: 'AccessControl',
    path: 'contracts/AccessControl_base',
  },
};
