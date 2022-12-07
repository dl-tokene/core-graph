import { assert, describe, newMockEvent, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  RequestCreated,
  RequestUpdated,
  RequestAccepted,
  RequestRejected,
  RequestDropped,
} from "../generated/ReviewableRequests/ReviewableRequests";
import {
  onRequestCreated,
  onRequestUpdated,
  onRequestAccepted,
  onRequestRejected,
  onRequestDropped,
} from "../src/mappings/ReviewableRequests";
import { getBlock, getTransaction } from "./utils/utils";

function createRequestCreatedEvent(
  requestId: BigInt,
  creator: Address,
  executor: Address,
  acceptData: Bytes,
  rejectData: Bytes,
  misc: string,
  description: string,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RequestCreated {
  let event = changetype<RequestCreated>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("requestId", ethereum.Value.fromUnsignedBigInt(requestId)));
  event.parameters.push(new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator)));
  event.parameters.push(new ethereum.EventParam("executor", ethereum.Value.fromAddress(executor)));
  event.parameters.push(new ethereum.EventParam("acceptData", ethereum.Value.fromBytes(acceptData)));
  event.parameters.push(new ethereum.EventParam("rejectData", ethereum.Value.fromBytes(rejectData)));
  event.parameters.push(new ethereum.EventParam("misc", ethereum.Value.fromString(misc)));
  event.parameters.push(new ethereum.EventParam("description", ethereum.Value.fromString(description)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRequestUpdatedEvent(
  requestId: BigInt,
  newRequestId: BigInt,
  executor: Address,
  acceptData: Bytes,
  rejectData: Bytes,
  misc: string,
  description: string,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RequestUpdated {
  let event = changetype<RequestUpdated>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("requestId", ethereum.Value.fromUnsignedBigInt(requestId)));
  event.parameters.push(new ethereum.EventParam("newRequestId", ethereum.Value.fromUnsignedBigInt(newRequestId)));
  event.parameters.push(new ethereum.EventParam("executor", ethereum.Value.fromAddress(executor)));
  event.parameters.push(new ethereum.EventParam("acceptData", ethereum.Value.fromBytes(acceptData)));
  event.parameters.push(new ethereum.EventParam("rejectData", ethereum.Value.fromBytes(rejectData)));
  event.parameters.push(new ethereum.EventParam("misc", ethereum.Value.fromString(misc)));
  event.parameters.push(new ethereum.EventParam("description", ethereum.Value.fromString(description)));
  event.block = block;
  event.transaction = tx;

  return event;
}

function createRequestAcceptedEvent(
  requestId: BigInt,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RequestAccepted {
  let event = changetype<RequestAccepted>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("requestId", ethereum.Value.fromUnsignedBigInt(requestId)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRequestRejectedEvent(
  requestId: BigInt,
  block: ethereum.Block,
  tx: ethereum.Transaction
): RequestRejected {
  let event = changetype<RequestRejected>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("requestId", ethereum.Value.fromUnsignedBigInt(requestId)));

  event.block = block;
  event.transaction = tx;

  return event;
}

function createRequestDroppedEvent(requestId: BigInt, block: ethereum.Block, tx: ethereum.Transaction): RequestDropped {
  let event = changetype<RequestDropped>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(new ethereum.EventParam("requestId", ethereum.Value.fromUnsignedBigInt(requestId)));

  event.block = block;
  event.transaction = tx;

  return event;
}

const block = getBlock(BigInt.fromI32(1), BigInt.fromI32(1));
const tx = getTransaction(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromI32(1))));

const requestId = BigInt.fromI32(1);
const creator = Address.fromString("0xb4Ff848014fB7eE928B42F8280f5EED1A24c0E0E");
const executor = Address.fromString("0x989F7514C41746bB6e1A12249EE8a851Ba6726BB");
const misc = "misc";
const description = "description";
const acceptData = Bytes.fromUTF8("accept data");
const rejectData = Bytes.fromUTF8("reject data");

describe("ReviewableRequests", () => {
  test("should handle RequestCreated", () => {
    let event = createRequestCreatedEvent(
      requestId,
      creator,
      executor,
      acceptData,
      rejectData,
      misc,
      description,
      block,
      tx
    );

    onRequestCreated(event);

    const status = BigInt.fromI32(1);

    assertRequest(requestId, creator, executor, acceptData, rejectData, misc, description, status);
  });

  test("should handle RequestUpdated", () => {
    const newRequestId = BigInt.fromI32(2);
    let event = createRequestUpdatedEvent(
      requestId,
      newRequestId,
      executor,
      acceptData,
      rejectData,
      misc,
      description,
      block,
      tx
    );

    onRequestUpdated(event);

    let status = BigInt.fromI32(1);

    assertRequest(newRequestId, creator, executor, acceptData, rejectData, misc, description, status);

    status = BigInt.fromI32(4);

    assertRequest(requestId, creator, executor, acceptData, rejectData, misc, description, status);
  });

  test("should handle RequestAccepted", () => {
    let event = createRequestAcceptedEvent(requestId, block, tx);

    onRequestAccepted(event);

    const status = BigInt.fromI32(2);

    assertRequest(requestId, creator, executor, acceptData, rejectData, misc, description, status);
  });

  test("should handle RequestRejected", () => {
    let event = createRequestRejectedEvent(requestId, block, tx);

    onRequestRejected(event);

    const status = BigInt.fromI32(3);

    assertRequest(requestId, creator, executor, acceptData, rejectData, misc, description, status);
  });

  test("should handle RequestDropped", () => {
    let event = createRequestDroppedEvent(requestId, block, tx);

    onRequestDropped(event);

    const status = BigInt.fromI32(4);

    assertRequest(requestId, creator, executor, acceptData, rejectData, misc, description, status);
  });
});

function assertRequest(
  requestId: BigInt,
  creator: Address,
  executor: Address,
  acceptData: Bytes,
  rejectData: Bytes,
  misc: string,
  description: string,
  status: BigInt
): void {
  const id = requestId.toString();

  assert.fieldEquals("Request", id, "creator", creator.toHexString());
  assert.fieldEquals("Request", id, "executor", executor.toHexString());
  assert.fieldEquals("Request", id, "acceptData", acceptData.toHexString());
  assert.fieldEquals("Request", id, "rejectData", rejectData.toHexString());
  assert.fieldEquals("Request", id, "misc", misc);
  assert.fieldEquals("Request", id, "description", description);
  assert.fieldEquals("Request", id, "status", status.toString());
}
