import { Role } from "../../../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";

export function getRole(id: string): Role {
  let entity = Role.load(id);

  if (entity == null) {
    entity = new Role(id);
    entity.resources = new Array<string>();
    entity.users = new Array<Bytes>();
  }

  return entity;
}
