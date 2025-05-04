const HDwalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDwalletProvider(
  "urban engage forward debris such myth pistol imitate tip fiber famous castle",
  "https://sepolia.infura.io/v3/9dedb0da6af44853826a14225a892968"
);

const web3 = new Web3(provider);

// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();
//   console.log("From : ", accounts[0]);
//   const result = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({ data: bytecode })
//     .send({ gas: "3000000", from: accounts[0] });
//   console.log("TO : ", result.options.address);
//   console.log(interface);
//   provider.engine.stop();
// };

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("From : ", accounts[0]);

  const contract = new web3.eth.Contract(JSON.parse(interface));
  const deployTx = contract.deploy({ data: bytecode });

  const gasEstimate = await deployTx.estimateGas({ from: accounts[0] });
  const gasPrice = await web3.eth.getGasPrice(); // use current network gas price

  const result = await deployTx.send({
    from: accounts[0],
    gas: gasEstimate,
    gasPrice: gasPrice,
  });

  console.log("TO : ", result.options.address);
  console.log(interface);
  provider.engine.stop();
};

deploy();
