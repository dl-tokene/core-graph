const yaml = require("js-yaml");
const fs = require("fs");
const pkg = require("../package.json");
require("dotenv").config();

const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN,
});

const subgraphConfig = "./subgraph.yaml";
const contracts = [
  "ConstantsRegistry",
  "RoleManagedRegistry",
  "MasterAccessManagement",
  "ReviewableRequests",
];

function validateConfig(config) {
  if (!config.startBlock || isNaN(parseInt(config.startBlock))) {
    throw new Error(`Invalid start block`);
  }

  if (!config.addresses) {
    throw new Error(`Invalid addresses`);
  }

  for (const contractName in config.addresses) {
    if (!contracts.includes(contractName)) {
      throw new Error(`Unknown contract ${contractName}`);
    }
  }
}

async function getConfig() {
  const responseBody = (await vault.read(process.env.CONFIG_PATH)).data;
  const config = responseBody.data;

  validateConfig(config);

  const doc = yaml.load(fs.readFileSync(subgraphConfig, "utf8"));

  for (const contractName in config.addresses) {
    const index = doc.dataSources.findIndex((val) => val.name === contractName);

    doc.dataSources[index].source.address = config.addresses[contractName];
    doc.dataSources[index].source.startBlock = config.startBlock;
  }

  fs.writeFileSync(subgraphConfig, yaml.dump(doc));

  pkg.scripts["create-local"] = pkg.scripts["create-local"].replace(
    "<core-graph>",
    config.projectName
  );
  pkg.scripts["deploy-local"] = pkg.scripts["deploy-local"].replace(
    "<core-graph>",
    config.projectName
  );
  pkg.scripts["remove-local"] = pkg.scripts["remove-local"].replace(
    "<core-graph>",
    config.projectName
  );

  fs.writeFileSync("./package.json", JSON.stringify(pkg));
}

getConfig().then();
