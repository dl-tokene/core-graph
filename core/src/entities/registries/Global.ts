import { Global } from "../../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getGlobal(
  id: string,
  MasterContractsRegistry: Address = Address.zero(),
  totalUsersCount: BigInt = BigInt.zero()
): Global {
  let entity = Global.load(id);

  if (entity == null) {
    entity = new Global(id);
    entity.MasterContractsRegistry = MasterContractsRegistry;
    entity.totalUsersCount = totalUsersCount;
  }

  return entity;
}
