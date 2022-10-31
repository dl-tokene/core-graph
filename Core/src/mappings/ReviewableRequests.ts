import {
  RequestCreated,
  RequestUpdated,
  RequestAccepted,
  RequestRejected,
  RequestDropped,
} from "../../generated/ReviewableRequests/ReviewableRequests";
import { getRequestsThread } from "../entities/requests/RequestsThread";
import { getRequest } from "../entities/requests/Request";
import { Address } from "@graphprotocol/graph-ts";
import { RequestStatus, getEnumBigInt } from "../entities/global/RequestStatusEnum";

export function onRequestCreated(event: RequestCreated): void {
  const params = event.params;
  let requestThread = getRequestsThread(params.requestId);
  let request = getRequest(
    params.requestId,
    params.creator,
    params.executor,
    params.acceptData,
    params.rejectData,
    params.description,
    getEnumBigInt(RequestStatus.CREATED),
    event.block.timestamp,
    requestThread.id
  );

  request.save();
  requestThread.save();
}

export function onRequestUpdated(event: RequestUpdated): void {
  const params = event.params;
  let request = getRequest(params.requestId);
  getRequest(
    params.newRequestId,
    Address.fromBytes(request.creator),
    params.executor,
    params.acceptData,
    params.rejectData,
    params.description,
    getEnumBigInt(RequestStatus.UPDATED),
    event.block.timestamp,
    request.thread
  ).save();
}

export function onRequestAccepted(event: RequestAccepted): void {
  let request = getRequest(event.params.requestId);
  request.status = getEnumBigInt(RequestStatus.ACCEPTED);
  request.save();
}

export function onRequestRejected(event: RequestRejected): void {
  let request = getRequest(event.params.requestId);
  request.status = getEnumBigInt(RequestStatus.REJECTED);
  request.save();
}

export function onRequestDropped(event: RequestDropped): void {
  let request = getRequest(event.params.requestId);
  request.status = getEnumBigInt(RequestStatus.DROPPED);
  request.save();
}
