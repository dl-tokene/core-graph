import { Bytes } from "@graphprotocol/graph-ts";
import {
  GrantedRoles,
  RevokedRoles,
  AddedPermissions,
  RemovedPermissions,
} from "../../generated/MasterAccessManagement/MasterAccessManagement";
import { getResource } from "../entities/rbac/Resource";
import { getRole } from "../entities/rbac/Role";
import { getUser } from "../entities/rbac/User";
import { extendArray, reduceArray } from "../helpers/ArrayHelper";

export function onGrantedRoles(event: GrantedRoles): void {
  const params = event.params;
  let user = getUser(params.to);
  user.roles = extendArray<string>(user.roles, params.rolesToGrant);
  for (let i = 0; i < params.rolesToGrant.length; i++) {
    let role = getRole(params.rolesToGrant[i]);
    role.users = extendArray<Bytes>(role.users, [user.id]);
    role.save();
  }

  user.save();
}

export function onRevokedRoles(event: RevokedRoles): void {
  const params = event.params;
  let user = getUser(params.from);
  user.roles = reduceArray<string>(user.roles, params.rolesToRevoke);
  for (let i = 0; i < params.rolesToRevoke.length; i++) {
    let role = getRole(params.rolesToRevoke[i]);
    role.users = reduceArray<Bytes>(role.users, [user.id]);
    role.save();
  }
  user.save();
}

export function onAddedPermissions(event: AddedPermissions): void {
  const params = event.params;
  let resource = getResource(params.role, params.resource);
  let role = getRole(params.role);
  role.resources = extendArray<string>(role.resources, [resource.id]);

  for (let i = 0; i < params.permissionsToAdd.length; i++) {
    if (params.allowed) {
      resource.allows = extendArray<string>(resource.allows, [params.permissionsToAdd[i]]);
    } else {
      resource.disallows = extendArray<string>(resource.disallows, [params.permissionsToAdd[i]]);
    }
  }

  role.save();
  resource.save();
}

export function onRemovedPermissions(event: RemovedPermissions): void {
  const params = event.params;
  let resource = getResource(params.role, params.resource);
  let role = getRole(params.role);

  for (let i = 0; i < params.permissionsToRemove.length; i++) {
    if (params.allowed) {
      resource.allows = reduceArray<string>(resource.allows, [params.permissionsToRemove[i]]);
    } else {
      resource.disallows = reduceArray<string>(resource.disallows, [params.permissionsToRemove[i]]);
    }
  }

  if (!resource.allows.length && !resource.disallows.length) {
    role.resources = reduceArray<string>(role.resources, [resource.id]);
    role.save();
  }

  resource.save();
}
