import { afterEach, assert, beforeAll, clearStore, describe, newMockEvent, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { AddedConstant, RemovedConstant } from "../generated/ConstantsRegistry/ConstantsRegistry";
import { onAddedConstant, onRemovedConstant } from "../src/mappings/ConstantsRegistry";
import { getBlock, getTransaction } from "./utils/utils";

function createAddedConstantEvent(
  name: string,
  value: Bytes,
  block: ethereum.Block,
  tx: ethereum.Transaction
): AddedConstant {
  let event = changetype<AddedConstant>(newMockEvent());
  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(name)));
  event.parameters.push(new ethereum.EventParam("value", ethereum.Value.fromBytes(value)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRemovedConstantEvent(name: string, block: ethereum.Block, tx: ethereum.Transaction): RemovedConstant {
  let event = changetype<RemovedConstant>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(name)));

  event.block = block;
  event.transaction = tx;
  return event;
}

const block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
const tx = getTransaction(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(1))));

const name = "first constant";

describe("ConstantRegistry", () => {
  test("should handle AddedConstant", () => {
    let value = Bytes.fromI32(55);
    let event = createAddedConstantEvent(name, value, block, tx);

    onAddedConstant(event);

    assertConstant(name, value);
  });

  test("should handle RemovedConstant", () => {
    let event = createRemovedConstantEvent(name, block, tx);

    onRemovedConstant(event);

    assert.notInStore("Constant", name);
  });
});

function assertConstant(name: string, value: Bytes): void {
  assert.fieldEquals("Constant", name, "value", value.toHexString());
}
