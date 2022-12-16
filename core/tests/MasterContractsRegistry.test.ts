import { assert, describe, newMockEvent, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  AddedContract,
  Initialized,
  RemovedContract,
} from "../generated/MasterContractsRegistry/MasterContractsRegistry";
import { onAddedContract, onInitialized, onRemovedContract } from "../src/mappings/MasterContractsRegistry";
import { getBlock, getTransaction } from "./utils/utils";
import { GLOBAL_ID } from "../src/entities/global/globals";

function createAddedContractEvent(
  name: string,
  address: Address,
  isProxy: boolean,
  block: ethereum.Block,
  tx: ethereum.Transaction
): AddedContract {
  let event = changetype<AddedContract>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(name)));
  event.parameters.push(new ethereum.EventParam("address", ethereum.Value.fromAddress(address)));
  event.parameters.push(new ethereum.EventParam("isProxy", ethereum.Value.fromBoolean(isProxy)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRemovedContractEvent(name: string, block: ethereum.Block, tx: ethereum.Transaction): RemovedContract {
  let event = changetype<RemovedContract>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(name)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createInitialized(
  masterContractsRegistry: Address,
  block: ethereum.Block,
  tx: ethereum.Transaction
): Initialized {
  let event = changetype<Initialized>(newMockEvent());

  event.address = masterContractsRegistry;
  event.block = block;
  event.transaction = tx;

  return event;
}

const block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
const tx = getTransaction(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(1))));

const name = "first contract";

describe("MasterContractsRegistry", () => {
  test("should handle AddedContract", () => {
    let address = Address.fromString("0xb4Ff848014fB7eE928B42F8280f5EED1A24c0E0E");
    let isProxy = false;
    let event = createAddedContractEvent(name, address, isProxy, block, tx);

    onAddedContract(event);

    assertContract(name, address, isProxy);
  });

  test("should handle RemovedContract", () => {
    let event = createRemovedContractEvent(name, block, tx);

    onRemovedContract(event);

    assert.notInStore("Contract", name);
  });

  test("should handle Initialized", () => {
    const masterContractsRegistry = Address.fromString("0xb4Ff848014fB7eE928B42F8280f5EED1A24c0E0E");
    let event = createInitialized(masterContractsRegistry, block, tx);

    onInitialized(event);

    const id = GLOBAL_ID;
    assert.fieldEquals("Global", id, "id", id);
    assert.fieldEquals("Global", id, "masterContractsRegistry", masterContractsRegistry.toHexString());
    assert.fieldEquals("Global", id, "totalUsersCount", "0");
  });
});

function assertContract(name: string, address: Address, isProxy: boolean): void {
  assert.fieldEquals("Contract", name, "address", address.toHexString());
  assert.fieldEquals("Contract", name, "isProxy", isProxy.toString());
}
