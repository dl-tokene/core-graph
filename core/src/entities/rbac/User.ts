import { User } from "../../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { getGlobal } from "../registries/Global";

export function getUser(id: Address): User {
  let entity = User.load(id);

  if (entity == null) {
    entity = new User(id);
    entity.rolesCount = BigInt.zero();
    entity.roles = new Array<string>();

    const global = getGlobal("global");
    global.totalUsersCount = global.totalUsersCount.plus(BigInt.fromI32(1));
    global.save();
  }

  return entity;
}
