const assert = require("assert");
const ganache = require("ganache-cli");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let fileStore;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  storeFiles = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["ipfs hash"],
    })
    .send({ from: accounts[0], gas: 6000000, gasPrice: 1000000000 });
});

describe("StoreFiles", () => {
  it("deploys a contract", () => {
    assert.ok(storeFiles.options.address);
  });

  it("adds and retrieves a file hash", async () => {
    const testHash = "QmTestHash123";

    await storeFiles.methods
      .addFile(testHash)
      .send({ from: accounts[0], gas: 6000000, gasPrice: 1000000000 });

    const result = await storeFiles.methods.getFiles(accounts[0]).call();

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], testHash);
  });
});
