import { store } from "@graphprotocol/graph-ts";
import {
  AddedContract,
  Initialized,
  RemovedContract,
} from "../../generated/MasterContractsRegistry/MasterContractsRegistry";
import { getContract } from "../entities/registries/Contract";
import { getGlobal } from "../entities/registries/Global";

export function onAddedContract(event: AddedContract): void {
  getContract(event.params.name, event.params.contractAddress, event.params.isProxy).save();
}

export function onRemovedContract(event: RemovedContract): void {
  store.remove("Contract", event.params.name);
}

export function onInitialized(event: Initialized): void {
  const global = getGlobal();
  global.masterContractsRegistry = event.address;
  global.save();
}
