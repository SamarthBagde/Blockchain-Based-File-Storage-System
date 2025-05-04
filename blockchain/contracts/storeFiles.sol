// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26; 
pragma experimental ABIEncoderV2;

contract FileStore {
    mapping(address => string[]) private files;

    function addFile(string memory ipfsHash) public {
        files[msg.sender].push(ipfsHash);
    }

    function getFiles(address user) public view returns (string[] memory) {
        return files[user];
    }
}
