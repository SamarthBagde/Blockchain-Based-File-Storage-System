import web3 from "./web3";

// const address = "0x9156d74d6E68b65B52E6a332432e9f9bDd929d9B"; // old
const address = "0x20885D25731712653BDA20e903f19ab980125146";

// const abi = [
//   {
//     constant: true,
//     inputs: [{ name: "user", type: "address" }],
//     name: "getFiles",
//     outputs: [{ name: "", type: "string[]" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "ipfsHash", type: "string" }],
//     name: "addFile",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ]; // old
const abi = [
  {
    constant: true,
    inputs: [{ name: "user", type: "address" }],
    name: "getFiles",
    outputs: [{ name: "", type: "string[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "ipfsHash", type: "string" }],
    name: "addFile",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default new web3.eth.Contract(abi, address);
