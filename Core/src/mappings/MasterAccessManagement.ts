import {
  GrantedRoles,
  RevokedRoles,
  AddedPermissions,
  RemovedPermissions,
} from "../../generated/MasterAccessManagement/MasterAccessManagement";
import { getResource } from "../entities/rbac/Resource";
import { getUser } from "../entities/rbac/User";
import { extendArray, reduceArray } from "../helpers/ArrayHelper";

export function onGrantedRoles(event: GrantedRoles): void {
  let user = getUser(event.params.to);
  user.roles = extendArray<string>(user.roles, event.params.rolesToGrant);
  user.save();
}

export function onRevokedRoles(event: RevokedRoles): void {
  let user = getUser(event.params.from);
  user.roles = reduceArray<string>(user.roles, event.params.rolesToRevoke);
  user.save();
}

export function onAddedPermissions(event: AddedPermissions): void {
  const params = event.params;
  let resource = getResource(params.role + params.resource);
  if (params.allowed) {
    resource.allows = extendArray<string>(resource.allows, params.permissionsToAdd);
  } else {
    resource.disallows = extendArray<string>(resource.disallows, params.permissionsToAdd);
  }
  resource.save();
}

export function onRemovedPermissions(event: RemovedPermissions): void {
  const params = event.params;
  let resource = getResource(params.role + params.resource);
  if (params.allowed) {
    resource.allows = reduceArray<string>(resource.allows, params.permissionsToRemove);
  } else {
    resource.disallows = reduceArray<string>(resource.disallows, params.permissionsToRemove);
  }
  resource.save();
}
