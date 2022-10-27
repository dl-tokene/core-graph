<<<<<<< HEAD
import { Bytes } from "@graphprotocol/graph-ts";
=======
>>>>>>> 1e92089 (rbac mappings)
import {
  GrantedRoles,
  RevokedRoles,
  AddedPermissions,
  RemovedPermissions,
} from "../../generated/MasterAccessManagement/MasterAccessManagement";
import { getResource } from "../entities/rbac/Resource";
<<<<<<< HEAD
import { getRole } from "../entities/rbac/Role";
=======
>>>>>>> 1e92089 (rbac mappings)
import { getUser } from "../entities/rbac/User";
import { extendArray, reduceArray } from "../helpers/ArrayHelper";

export function onGrantedRoles(event: GrantedRoles): void {
<<<<<<< HEAD
  const params = event.params;
  let user = getUser(params.to);
  user.roles = extendArray<string>(user.roles, params.rolesToGrant);
  for (let i = 0; i < params.rolesToGrant.length; i++) {
    let role = getRole(params.rolesToGrant[i]);
    role.users = extendArray<Bytes>(role.users, [user.id]);
    role.save();
  }

=======
  let user = getUser(event.params.to);
  user.roles = extendArray<string>(user.roles, event.params.rolesToGrant);
>>>>>>> 1e92089 (rbac mappings)
  user.save();
}

export function onRevokedRoles(event: RevokedRoles): void {
<<<<<<< HEAD
  const params = event.params;
  let user = getUser(params.from);
  user.roles = reduceArray<string>(user.roles, params.rolesToRevoke);
  for (let i = 0; i < params.rolesToRevoke.length; i++) {
    let role = getRole(params.rolesToRevoke[i]);
    role.users = reduceArray<Bytes>(role.users, [user.id]);
    role.save();
  }
=======
  let user = getUser(event.params.from);
  user.roles = reduceArray<string>(user.roles, event.params.rolesToRevoke);
>>>>>>> 1e92089 (rbac mappings)
  user.save();
}

export function onAddedPermissions(event: AddedPermissions): void {
  const params = event.params;
<<<<<<< HEAD
  let resource = getResource(params.role, params.resource);
  let role = getRole(params.role);
  role.resources = extendArray<string>(role.resources, [resource.id]);

  for (let i = 0; i < params.permissionsToAdd.length; i++) {
    let permission = getResource(params.role, params.permissionsToAdd[i]);
    if (params.allowed) {
      resource.allows = extendArray<string>(resource.allows, [permission.id]);
    } else {
      resource.disallows = extendArray<string>(resource.disallows, [permission.id]);
    }
    permission.save();
  }

  role.save();
=======
  let resource = getResource(params.role + params.resource);
  if (params.allowed) {
    resource.allows = extendArray<string>(resource.allows, params.permissionsToAdd);
  } else {
    resource.disallows = extendArray<string>(resource.disallows, params.permissionsToAdd);
  }
>>>>>>> 1e92089 (rbac mappings)
  resource.save();
}

export function onRemovedPermissions(event: RemovedPermissions): void {
  const params = event.params;
<<<<<<< HEAD
  let resource = getResource(params.role, params.resource);
  let role = getRole(params.role);

  for (let i = 0; i < params.permissionsToRemove.length; i++) {
    let permission = getResource(params.role, params.permissionsToRemove[i]);
    if (params.allowed) {
      resource.allows = reduceArray<string>(resource.allows, [permission.id]);
    } else {
      resource.disallows = reduceArray<string>(resource.disallows, [permission.id]);
    }
    // permission.save();
  }

  if (!resource.allows.length && !resource.disallows.length) {
    role.resources = reduceArray<string>(role.resources, [resource.id]);
    role.save();
  }

=======
  let resource = getResource(params.role + params.resource);
  if (params.allowed) {
    resource.allows = reduceArray<string>(resource.allows, params.permissionsToRemove);
  } else {
    resource.disallows = reduceArray<string>(resource.disallows, params.permissionsToRemove);
  }
>>>>>>> 1e92089 (rbac mappings)
  resource.save();
}
