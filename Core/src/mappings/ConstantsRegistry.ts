import { store } from "@graphprotocol/graph-ts";
import { AddedConstant, RemovedConstans } from "../../generated/ConstantsRegistry/ConstantsRegistry";
import { getConstant } from "../entities/registries/Constant";

export function onAddedConstant(event: AddedConstant): void {
  getConstant(event.params.name, event.params.value).save();
}

export function onRemovedConstant(event: RemovedConstans): void {
  store.remove("Constant", event.params.name);
}
