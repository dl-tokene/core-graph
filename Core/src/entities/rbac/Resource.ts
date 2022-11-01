import { Resource } from "../../../generated/schema";

<<<<<<< HEAD
export function getResource(role: string, resource: string): Resource {
  const id = role + resource;
=======
export function getResource(id: string): Resource {
>>>>>>> 1e92089 (rbac mappings)
  let entity = Resource.load(id);

  if (entity == null) {
    entity = new Resource(id);
    entity.allows = new Array<string>();
    entity.disallows = new Array<string>();
  }

  return entity;
}
