import { assert, describe, newMockEvent, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  GrantedRoles,
  RevokedRoles,
  AddedPermissions,
  RemovedPermissions,
  AddedRoleWithDescription,
} from "../generated/MasterAccessManagement/MasterAccessManagement";
import {
  onGrantedRoles,
  onRevokedRoles,
  onAddedPermissions,
  onRemovedPermissions,
  onAddedRoleWithDescription,
} from "../src/mappings/MasterAccessManagement";
import { getBlock, getTransaction } from "./utils/utils";

function createGrantedRolesEvent(
  to: Address,
  rolesToGrant: Array<string>,
  block: ethereum.Block,
  tx: ethereum.Transaction
): GrantedRoles {
  let event = changetype<GrantedRoles>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
  event.parameters.push(new ethereum.EventParam("rolesToGrant", ethereum.Value.fromStringArray(rolesToGrant)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRevokedRolesEvent(
  from: Address,
  rolesToRevoke: Array<string>,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RevokedRoles {
  let event = changetype<RevokedRoles>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("from", ethereum.Value.fromAddress(from)));
  event.parameters.push(new ethereum.EventParam("rolesToRevoke", ethereum.Value.fromStringArray(rolesToRevoke)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createAddedPermissionsEvent(
  role: string,
  resource: string,
  permissionsToAdd: Array<string>,
  allowed: boolean,
  block: ethereum.Block,
  tx: ethereum.Transaction
): AddedPermissions {
  let event = changetype<AddedPermissions>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromString(role)));
  event.parameters.push(new ethereum.EventParam("resource", ethereum.Value.fromString(resource)));
  event.parameters.push(new ethereum.EventParam("permissionsToAdd", ethereum.Value.fromStringArray(permissionsToAdd)));
  event.parameters.push(new ethereum.EventParam("allowed", ethereum.Value.fromBoolean(allowed)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRemovedPermissionsEvent(
  role: string,
  resource: string,
  permissionsToRemove: Array<string>,
  allowed: boolean,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RemovedPermissions {
  let event = changetype<RemovedPermissions>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromString(role)));
  event.parameters.push(new ethereum.EventParam("resource", ethereum.Value.fromString(resource)));
  event.parameters.push(
    new ethereum.EventParam("permissionsToRemove", ethereum.Value.fromStringArray(permissionsToRemove))
  );
  event.parameters.push(new ethereum.EventParam("allowed", ethereum.Value.fromBoolean(allowed)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createAddedRoleWithDescriptionEvent(
  role: string,
  description: string,
  block: ethereum.Block,
  tx: ethereum.Transaction
): AddedRoleWithDescription {
  let event = changetype<AddedRoleWithDescription>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromString(role)));
  event.parameters.push(new ethereum.EventParam("description", ethereum.Value.fromString(description)));

  event.block = block;
  event.transaction = tx;

  return event;
}

const block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
const tx = getTransaction(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(1))));

const userAddress = Address.fromString("0xb4Ff848014fB7eE928B42F8280f5EED1A24c0E0E");

const testRole = "test_role";
const testResource = "test_resource";

describe("MasterAccessManagement", () => {
  test("should handle GrantedRoles", () => {
    let rolesToGrant = ["role1", "role2", "role3"];
    let event = createGrantedRolesEvent(userAddress, rolesToGrant, block, tx);

    onGrantedRoles(event);

    assertUserRoles(userAddress.toHexString(), rolesToGrant);
    const description = "";
    assertRole("role1", description, [], [userAddress.toHexString()]);
    assertRole("role2", description, [], [userAddress.toHexString()]);
    assertRole("role3", description, [], [userAddress.toHexString()]);
  });

  test("should handle RevokedRoles", () => {
    let rolesToRevoke = ["role2", "role3"];
    let event = createRevokedRolesEvent(userAddress, rolesToRevoke, block, tx);

    onRevokedRoles(event);

    assertUserRoles(userAddress.toHexString(), ["role1"]);
    assertRole("role1", "", [], [userAddress.toHexString()]);
    assert.notInStore("Role", "role2");
    assert.notInStore("Role", "role3");
  });

  test("should handle AddedPermissions", () => {
    let allowedPermissionsToAdd = ["allowed1", "allowed2", "allowed3"];
    let event = createAddedPermissionsEvent(testRole, testResource, allowedPermissionsToAdd, true, block, tx);

    onAddedPermissions(event);

    let disallowedPermissionsToAdd = ["disallowed1"];
    event = createAddedPermissionsEvent(testRole, testResource, disallowedPermissionsToAdd, false, block, tx);
    onAddedPermissions(event);

    assertResources(testRole, testResource, allowedPermissionsToAdd, disallowedPermissionsToAdd);
    assertRole(testRole, "", [testRole + "_" + testResource], []);
  });

  test("should handle RemovedPermissions", () => {
    let allowedPermissionsToRemove = ["allowed1", "allowed2", "allowed3"];
    let event = createRemovedPermissionsEvent(testRole, testResource, allowedPermissionsToRemove, true, block, tx);

    onRemovedPermissions(event);

    assertResources(testRole, testResource, [], ["disallowed1"]);
    assertRole(testRole, "", [testRole + "_" + testResource], []);

    allowedPermissionsToRemove = ["disallowed1"];
    event = createRemovedPermissionsEvent(testRole, testResource, allowedPermissionsToRemove, false, block, tx);

    onRemovedPermissions(event);
    assert.notInStore("Resource", testRole + testResource);
    assert.notInStore("Role", testRole);
  });

  test("should handle AddedRoleWithDescription", () => {
    const description = "test description";
    const event = createAddedRoleWithDescriptionEvent(testRole, description, block, tx);

    onAddedRoleWithDescription(event);

    assertRole(testRole, description, [], []);
  });

  test("should handle AddedPermissions and AddedRoleWithDescription", () => {
    const newTestRole = "new test role";
    let allowedPermissionsToAdd = ["allowed1", "allowed2", "allowed3"];
    let event = createAddedPermissionsEvent(newTestRole, testResource, allowedPermissionsToAdd, true, block, tx);

    onAddedPermissions(event);

    let disallowedPermissionsToAdd = ["disallowed1"];
    event = createAddedPermissionsEvent(newTestRole, testResource, disallowedPermissionsToAdd, false, block, tx);
    onAddedPermissions(event);

    assertResources(newTestRole, testResource, allowedPermissionsToAdd, disallowedPermissionsToAdd);
    assertRole(newTestRole, "", [newTestRole + "_" + testResource], []);

    const description = "test description";
    const descriptionEvent = createAddedRoleWithDescriptionEvent(newTestRole, description, block, tx);

    onAddedRoleWithDescription(descriptionEvent);

    assertRole(newTestRole, description, [newTestRole + "_" + testResource], []);
  });
});

function assertUserRoles(id: string, roles: Array<string>): void {
  assert.fieldEquals("User", id, "roles", "[" + roles.join(", ") + "]");
  assert.fieldEquals("User", id, "rolesCount", roles.length.toString());
}

function assertResources(role: string, resource: string, allows: Array<string>, disallows: Array<string>): void {
  const id = role + "_" + resource;
  assert.fieldEquals("Resource", id, "name", resource);
  assert.fieldEquals("Resource", id, "allowsCount", allows.length.toString());
  assert.fieldEquals("Resource", id, "disallowsCount", disallows.length.toString());
  assert.fieldEquals("Resource", id, "allows", "[" + allows.join(", ") + "]");
  assert.fieldEquals("Resource", id, "disallows", "[" + disallows.join(", ") + "]");
}

function assertRole(role: string, description: string, resources: Array<string>, users: Array<string>): void {
  assert.fieldEquals("Role", role, "description", description);
  assert.fieldEquals("Role", role, "resourcesCount", resources.length.toString());
  assert.fieldEquals("Role", role, "usersCount", users.length.toString());

  assert.fieldEquals("Role", role, "resources", "[" + resources.join(", ") + "]");
  assert.fieldEquals("Role", role, "users", "[" + users.join(", ") + "]");
}
