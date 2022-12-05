import { BigInt } from "@graphprotocol/graph-ts";
import { Resource } from "../../../generated/schema";

export function getResource(role: string, resource: string): Resource {
  const id = role + "_" + resource;
  let entity = Resource.load(id);

  if (entity == null) {
    entity = new Resource(id);
    entity.name = resource;
    entity.allowsCount = BigInt.zero();
    entity.disallowsCount = BigInt.zero();
    entity.allows = new Array<string>();
    entity.disallows = new Array<string>();
  }

  return entity;
}
