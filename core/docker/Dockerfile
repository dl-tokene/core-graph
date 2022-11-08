FROM node:16-alpine
RUN apk add --no-cache make gcc g++ python3

WORKDIR /tokene-graph

COPY docker/package.json ./
COPY docker/package-lock.json ./

COPY abis ./abis
COPY src ./src
COPY scripts ./scripts
COPY schema.graphql ./
COPY subgraph.yaml ./
COPY tsconfig.json ./

RUN npm install

ENTRYPOINT ["npm", "run"]
