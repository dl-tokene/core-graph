import { Global } from "../../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { GLOBAL_ID } from "../global/globals";

export function getGlobal(): Global {
  let entity = Global.load(GLOBAL_ID);

  if (entity == null) {
    entity = new Global(GLOBAL_ID);
    entity.masterContractsRegistry = Address.zero();
    entity.totalUsersCount = BigInt.zero();
  }

  return entity;
}
