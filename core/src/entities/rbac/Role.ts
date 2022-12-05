import { Role } from "../../../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function getRole(id: string): Role {
  let entity = Role.load(id);

  if (entity == null) {
    entity = new Role(id);
    entity.description = "";
    entity.resourcesCount = BigInt.zero();
    entity.usersCount = BigInt.zero();
    entity.resources = new Array<string>();
    entity.users = new Array<Bytes>();
  }

  return entity;
}
