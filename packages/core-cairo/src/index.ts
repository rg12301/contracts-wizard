import type { CommonOptions } from './common-options';
import { printERC20, defaults as erc20defaults } from './erc20';
import { printERC721, defaults as erc721defaults } from './erc721';

export type { GenericOptions, KindedOptions } from './build-generic';
export { buildGeneric } from './build-generic';

export type { Contract } from './contract';
export { ContractBuilder } from './contract';

export { printContract } from './print';

export type { Access } from './set-access-control';
export type { Upgradeable } from './set-upgradeable';
export type { Info } from './set-info';

export { premintPattern } from './erc20';

export { defaults as infoDefaults } from './set-info';

export type { OptionsErrorMessages } from './error';
export { OptionsError } from './error';

export type { Kind } from './kind';
export { sanitizeKind } from './kind';

export { contractsVersion } from './utils/version';


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

export const erc20 = {
  print: printERC20,
  defaults: erc20defaults
}
export const erc721 = {
  print: printERC721,
  defaults: erc721defaults
}