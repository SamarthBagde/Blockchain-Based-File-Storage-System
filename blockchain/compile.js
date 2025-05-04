const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const storeFilesPath = path.resolve(__dirname, "contracts", "storeFiles.sol");
const source = fs.readFileSync(storeFilesPath, "utf8");
module.exports = solc.compile(source, 1).contracts[":FileStore"];
