import { type ERC20Options, buildERC20 } from "./erc20";
import { type ERC721Options, buildERC721 } from "./erc721";
import { printContract } from "./print";

export function printERC20(opts: ERC20Options): string {
  return printContract(buildERC20(opts));
}

export function printERC721(opts: ERC721Options): string {
  return printContract(buildERC721(opts));
}