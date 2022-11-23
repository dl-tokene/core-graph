### Get all roles and their permissions for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    roles {
        id
        resources {
            id
            name
            allows
            disallows
        }
    }
}
```
### Get roles filtered by resources for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    roles(where: {resources_: {name_in: ["<RESOURCE_NAME>", ...]}}) {
        id
        resources {
            id
            name
            allows
            disallows
        }
    }
}
```
### Get all resources for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51611%3A38338&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    resources {
        id
        name
    }
}
```

### Get role by name for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51611%3A38043&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    role(id: "<ROLE_NAME>") {
        id
        resources {
            id
            name
            allows
            disallows
        }
    }
}
```

### Get all users for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51596%3A36257&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    users {
        id
        roles {
            id
        }
    }
}
```

### Get roles for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51807%3A42372&t=05DFDFtMRIWkL7o6-4)
```graphql
{
    roles(where: {id_not_in: ["id", ...]}) {
        id
    }
}
```

### Get users filtered by roles

```graphql
{
    users(where: {roles_: {id_in: ["<ROLE_NAME>", ...]}}) {
        id
        roles {
            id
        }
    }
}
```
