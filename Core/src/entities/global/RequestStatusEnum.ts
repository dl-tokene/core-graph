import { BigInt } from "@graphprotocol/graph-ts";

export enum RequestStatus {
  CREATED = 1,
  UPDATED = 2,
  ACCEPTED = 3,
  REJECTED = 4,
  DROPPED = 5,
}

export function getEnumBigInt(operation: RequestStatus): BigInt {
  return BigInt.fromI32(operation as i32);
}
