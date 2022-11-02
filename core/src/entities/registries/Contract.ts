import { Contract } from "../../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

export function getContract(id: string, address: Address = Address.zero(), isProxy: boolean = false): Contract {
  let entity = Contract.load(id);

  if (entity == null) {
    entity = new Contract(id);
    entity.address = address;
    entity.isProxy = isProxy;
  }

  return entity;
}
