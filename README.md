# Blockchain-Based Decentralized Encrypted File Storage System 🔐

A decentralized, secure file storage application leveraging **Ethereum Smart Contracts**, **Python Flask encryption microservices**, and a **React (Material UI) frontend** to store and manage encrypted file hashes on-chain.

---

## 📌 Overview

Traditional cloud storage platforms present single points of failure and data privacy concerns. This project combines **client-side symmetric encryption (AES Fernet)** with **Ethereum Smart Contracts** to ensure:
1. **End-to-End Encryption**: Files are encrypted with user passwords using PBKDF2HMAC key derivation before off-chain storage.
2. **Immutable On-Chain Mapping**: IPFS/storage file hashes are recorded immutably on the Ethereum blockchain under user wallet addresses (`mapping(address => string[])`).
3. **Decentralized Access Control**: Only the wallet owner can retrieve their file references and decrypt them with their master password.


### Tech Stack Breakdown
- **Frontend**: React 19, Material UI (`@mui/material`), `react-router-dom`, `web3.js`, `axios`.
- **Backend Service**: Python 3, Flask, Flask-CORS, `cryptography` (PBKDF2HMAC SHA256 & Fernet).
- **Blockchain Layer**: Ethereum Solidity (`^0.4.26`), Web3.js, Ganache / Ethereum Testnet.

---
