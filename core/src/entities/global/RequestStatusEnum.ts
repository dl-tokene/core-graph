import { BigInt } from "@graphprotocol/graph-ts";

export enum RequestStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  DROPPED = 4,
}

export function getEnumBigInt(operation: RequestStatus): BigInt {
  return BigInt.fromI32(operation as i32);
}
