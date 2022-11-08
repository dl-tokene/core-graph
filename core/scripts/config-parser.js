const yaml = require("js-yaml");
const fs = require("fs");
const fetch = require("node-fetch");
const pkg = require("../package.json");
require("dotenv").config();

const subgraphConfig = "./subgraph.yaml";
const contracts = [
  "ConstantsRegistry",
  "RoleManagedRegistry",
  "MasterAccessManagement",
  "ReviewableRequests",
];

async function getConfig() {
  const response = await fetch(process.env.CONFIG_ENDPOINT);
  if (!response.ok) {
    throw new Error(
      `Error while fetching config: ${response.status} ${response.statusText}`
    );
  }
  const config = await response.json();
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

function validateConfig(config) {
  if (!config.startBlock || isNaN(parseInt(config.startBlock))) {
    throw new Error(`Invalid start block`);
  }

  if (!config.addresses) {
    throw new Error(`Invalid adresses`);
  }

  for (const contractName in config.addresses) {
    if (!contracts.includes(contractName)) {
      throw new Error(`Unknown contract ${contractName}`);
    }
  }
}

getConfig().then();
