/* eslint-disable */
/
 
This file was automatically generated by json-schema-to-typescript.
DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
and run json-schema-to-typescript to regenerate this file.*/

export type ContractCallArgs =
  | GetLastVault
  | ClaimVault
  | GetAuctionInfo
  | StartOrPlaceBid
  | ClaimTokens
  | FtBalanceOf
/
 
NEAR Account Identifier.*
This is a unique, syntactically valid, human-readable account identifier on the NEAR network.*
[See the crate-level docs for information about validation.](index.html#account-id-rules)*
Also see [Error kind precedence](AccountId#error-kind-precedence).*
## Examples*
``` use near_account_id::AccountId;*
let alice: AccountId = "alice.near".parse().unwrap();*
assert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```*/
export type AccountId = string;

export interface GetLastVault {}
export interface ClaimVault { index: number; }
export interface GetAuctionInfo {}
export interface StartOrPlaceBid {}
export interface ClaimTokens {}
export interface FtBalanceOf {  account_id: AccountId;  }