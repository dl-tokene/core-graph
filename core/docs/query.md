### Get all roles and their permissions (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)
```
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
### Get roles filtered by resources (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)
```
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
### Get all resources (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51611%3A38338&t=05DFDFtMRIWkL7o6-4)
```
{
    resources {
        id
        name
    }
}
```

### Get role by name (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51611%3A38043&t=05DFDFtMRIWkL7o6-4)
```
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

### Get all users (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51596%3A36257&t=05DFDFtMRIWkL7o6-4)
```
{
    users {
        id
        roles {
            id
        }
    }
}
```

### Get users filtered by roles
```
{
    users(where: {roles_: {id_in: ["<ROLE_NAME>", ...]}}) {
        id
        roles {
            id
        }
    }
}
```

### Get roles (https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51807%3A42372&t=05DFDFtMRIWkL7o6-4)
```
{
    roles(where: {id_not_in: ["id", ...]}) {
        id
    }
}
```