
export function getEntity(id: Bytes, optionalArg: BigInt = BigInt.zero()): Entity {
    let entity = Entity.load(id);

    if (entity == null) {
        entity = new Entity(id);
    }
    
    return entity;
} 