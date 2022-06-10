import type { CommonOptions } from './common-options';
import { printERC20, defaults as erc20defaults, ERC20Options, getInitialSupply } from './erc20';
import { printERC721, defaults as erc721defaults, ERC721Options } from './erc721';
import { toUint256 } from './utils/uint256';

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

export interface ERC20 extends WizardContractAPI {
  defaults: Required<ERC20Options>;

  /**
   * Calculates the initial supply that would be used in an ERC20 contract based on a given premint amount and number of decimals.
   */
  getInitialSupply: (premint: string, decimals: number) => string;
}

export interface ERC721 extends WizardContractAPI {
  defaults: Required<ERC721Options>;
}

export const erc20: ERC20 = {
  print: printERC20,
  defaults: erc20defaults,
  getInitialSupply
}
export const erc721 = {
  print: printERC721,
  defaults: erc721defaults
}
export const utils = {
  toUint256
}