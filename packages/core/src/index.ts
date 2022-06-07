import type { CommonOptions } from './common-options';
import { printERC20, defaults as erc20defaults, ERC20Options } from './erc20';
import { printERC721, defaults as erc721defaults, ERC721Options } from './erc721';
import { printERC1155, defaults as erc1155defaults, ERC1155Options } from './erc1155';
import { printGovernor, defaults as governorDefaults, GovernorOptions } from './governor';
import type { GenericOptions } from './build-generic';

export type { GenericOptions, KindedOptions } from './build-generic';
export { buildGeneric } from './build-generic';

export type { Contract } from './contract';
export { ContractBuilder } from './contract';

export { printContract } from './print';
export { printContractVersioned } from './print-versioned';

export type { Access } from './set-access-control';
export type { Upgradeable } from './set-upgradeable';
export type { Info } from './set-info';

export { premintPattern } from './erc20';
export { defaults as infoDefaults } from './set-info';

export type { OptionsErrorMessages } from './error';
export { OptionsError } from './error';

export type { Kind } from './kind';
export { sanitizeKind } from './kind';


export interface WizardContractAPI {
  /**
   * Returns a string representation of a contract generated using the provided options. If opts is not provided, uses `defaults`.
   */
  print: (opts?: any) => string,
  
  /**
   * The default options that are used for `print`.
   */
   defaults: CommonOptions;
}

export const erc20: WizardContractAPI = {
  print: printERC20,
  defaults: erc20defaults
}
export const erc721: WizardContractAPI = {
  print: printERC721,
  defaults: erc721defaults
}
export const erc1155: WizardContractAPI = {
  print: printERC1155,
  defaults: erc1155defaults
}
export const governor: WizardContractAPI = {
  print: printGovernor,
  defaults: governorDefaults
}