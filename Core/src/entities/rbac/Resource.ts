import { Resource } from "../../../generated/schema";

export function getResource(id: string): Resource {
  let entity = Resource.load(id);

  if (entity == null) {
    entity = new Resource(id);
    entity.allows = new Array<string>();
    entity.disallows = new Array<string>();
  }

  return entity;
}
