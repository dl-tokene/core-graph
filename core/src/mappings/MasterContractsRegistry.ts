import { store } from "@graphprotocol/graph-ts";
import { AddedContract, RemovedContract } from "../../generated/MasterContractsRegistry/MasterContractsRegistry";
import { getContract } from "../entities/registries/Contract";

export function onAddedContract(event: AddedContract): void {
  getContract(event.params.name, event.params.contractAddress, event.params.isProxy).save();
}

export function onRemovedContract(event: RemovedContract): void {
  store.remove("Contract", event.params.name);
}
