import { Request } from "../../../generated/schema";
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

export function getRequest(
  requestId: BigInt,
  creator: Address = Address.zero(),
  executor: Address = Address.zero(),
  acceptData: Bytes = Bytes.empty(),
  rejectData: Bytes = Bytes.empty(),
  description: string = "",
  status: BigInt = BigInt.zero(),
  timestamp: BigInt = BigInt.zero(),
  thread: Bytes = Bytes.empty()
): Request {
  const id = Bytes.fromByteArray(Bytes.fromBigInt(requestId));
  let entity = Request.load(id);

  if (entity == null) {
    entity = new Request(id);
    entity.requestId = BigInt.fromByteArray(id);
    entity.creator = creator;
    entity.executor = executor;
    entity.acceptData = acceptData;
    entity.rejectData = rejectData;
    entity.description = description;
    entity.status = status;
    entity.timestamp = timestamp;
    entity.thread = thread;
  }

  return entity;
}
