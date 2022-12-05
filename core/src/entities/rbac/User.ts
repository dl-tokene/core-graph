import { User } from "../../../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getUser(id: Address): User {
  let entity = User.load(id);

  if (entity == null) {
    entity = new User(id);
    entity.rolesCount = BigInt.zero();
    entity.roles = new Array<string>();
  }

  return entity;
}
