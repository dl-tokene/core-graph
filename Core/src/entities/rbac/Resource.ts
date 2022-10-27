import { Resource } from "../../../generated/schema";

export function getResource(role: string, resource: string): Resource {
  const id = role + resource;
  let entity = Resource.load(id);

  if (entity == null) {
    entity = new Resource(id);
    entity.allows = new Array<string>();
    entity.disallows = new Array<string>();
  }

  return entity;
}
