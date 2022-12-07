## Key values

### Get all constants for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=52480%3A55016&t=KmJqsyUTYcZGmiKu-4)
```graphql
{
    constants {
        id
        value
    }
}
```
### Get value by key
```graphql
{
    constant(id: "<KEY>") {
        id
        value
    }
}
```



## Users

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

### Get users filtered by roles. `id_in` gets array with the users roles.

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



## Roles

### Get all roles and their permissions for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    roles {
        id
        resourcesCount
        resources {
            id
            name
            allows
            disallows
            allowsCount
            disallowsCount
        }
    }
}
```
### Get roles filtered by resources for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51547%3A35182&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    roles(where: {resources_: {name_in: ["<RESOURCE_NAME>", ...]}}) {
        id
        resourcesCount
        resources {
            id
            name
            allows
            disallows
            allowsCount
            disallowsCount
        }
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
            allowsCount
            disallowsCount
        }
    }
}
```

### Get available roles without already enabled ones for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51807%3A42372&t=05DFDFtMRIWkL7o6-4)
### `id_not_in` gets array with enabled roles
```graphql
{
    roles(where: {id_not_in: ["id", ...]}) {
        id
    }
}
```



## Resources

### Get all resources for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=51611%3A38338&t=05DFDFtMRIWkL7o6-4)

```graphql
{
    resources {
        id
        name
    }
}
```



## Requests
### Get all requests for [Figma frame](https://www.figma.com/file/e5NCJsDKGJ7ez8KGtUnDbs/%F0%9F%94%97-TokenE?node-id=52373%3A47454&t=KmJqsyUTYcZGmiKu-4)
```graphql
{
    requests {
      id
      requestId
      creator
      executor
      acceptData
      rejectData
      description
      status
      timestamp
    }
}
```

### Get all requests filtered by status
```graphql
{
    requests(where:{status:<status>}){
      id
      requestId
      creator
      executor
      acceptData
      rejectData
      description
      status
      timestamp
    }
}
```

### Get all request threads with its requests
```graphql
{
  requestsThreads {
    id
    requests {
      id
      requestId
      creator
      executor
      acceptData
      rejectData
      description
      status
      timestamp
    }
  }
}
```

### Get all requests in thread 
```graphql
{
  requestsThreads(where: {id: "<ID_OF_FIRST_REQUEST_IN_THREAD>"}) {
    id
    requests {
      id
      requestId
      creator
      executor
      acceptData
      rejectData
      description
      status
      timestamp
    }
  }
}
```

### Get all requests in thread filtered by status
```graphql
{
  requestsThreads(where: {id: "<ID_OF_FIRST_REQUEST_IN_THREAD>"}) {
    id
    requests(where: {status:<status>}) {
      id
      requestId
      creator
      executor
      acceptData
      rejectData
      description
      status
      timestamp
    }
  }
}
```
