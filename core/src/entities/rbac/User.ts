import { User } from "../../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

export function getUser(id: Address): User {
  let entity = User.load(id);

  if (entity == null) {
    entity = new User(id);
    entity.roles = new Array<string>();
  }

  return entity;
}
