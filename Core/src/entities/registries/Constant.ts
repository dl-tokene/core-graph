import { Constant } from "../../../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";

export function getConstant(id: string, value: Bytes = Bytes.empty()): Constant {
  let entity = Constant.load(id);

  if (entity == null) {
    entity = new Constant(id);
    entity.value = value;
  }

  return entity;
}
