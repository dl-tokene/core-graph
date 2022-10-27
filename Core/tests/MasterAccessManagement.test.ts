import { assert, describe, newMockEvent, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  GrantedRoles,
  RevokedRoles,
  AddedPermissions,
  RemovedPermissions,
} from "../generated/MasterAccessManagement/MasterAccessManagement";
import {
  onGrantedRoles,
  onRevokedRoles,
  onAddedPermissions,
  onRemovedPermissions,
} from "../src/mappings/MasterAccessManagement";
import { getBlock, getTransaction } from "./utils";

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
  });

  test("should handle RevokedRoles", () => {
    let rolesToRevoke = ["role2", "role3"];
    let event = createRevokedRolesEvent(userAddress, rolesToRevoke, block, tx);

    onRevokedRoles(event);

    assertUserRoles(userAddress.toHexString(), ["role1"]);
  });

  test("should handle AddedPermissions", () => {
    let allowedPermissionsToAdd = ["allowed1", "allowed2", "allowed3"];
    let event = createAddedPermissionsEvent(testRole, testResource, allowedPermissionsToAdd, true, block, tx);

    onAddedPermissions(event);

    let disallowedPermissionsToAdd = ["disallowed1"];
    event = createAddedPermissionsEvent(testRole, testResource, disallowedPermissionsToAdd, false, block, tx);
    onAddedPermissions(event);

    assertResources(testRole + testResource, allowedPermissionsToAdd, disallowedPermissionsToAdd);
  });

  test("should handle RemovedPermissions", () => {
    let allowedPermissionsToRemove = ["allowed1", "allowed2"];
    let event = createRemovedPermissionsEvent(testRole, testResource, allowedPermissionsToRemove, true, block, tx);

    onRemovedPermissions(event);

    assertResources(testRole + testResource, ["allowed3"], ["disallowed1"]);
  });
});

function assertUserRoles(id: string, roles: Array<string>): void {
  assert.fieldEquals("User", id, "roles", "[" + roles.join(", ") + "]");
}

function assertResources(id: string, allows: Array<string>, disallows: Array<string>): void {
  assert.fieldEquals("Resource", id, "allows", "[" + allows.join(", ") + "]");
  assert.fieldEquals("Resource", id, "disallows", "[" + disallows.join(", ") + "]");
}
