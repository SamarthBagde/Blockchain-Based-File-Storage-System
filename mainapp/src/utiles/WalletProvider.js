import React, { createContext, useState, useEffect } from "react";
import web3 from "../web3";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAddress(accounts[0]);
        } catch (err) {
          console.error("Error fetching account:", err);
        }
      } else {
        console.log("Please install MetaMask");
      }
    };

    loadWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ address }}>
      {children}
    </WalletContext.Provider>
  );
};
