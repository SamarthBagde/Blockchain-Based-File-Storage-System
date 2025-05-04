import React, { useState, useContext, useEffect } from "react";
import storeFile from "../storeFile";
import "../style/allMyFiles.css";
import Navbar from "./navBar";
import { WalletContext } from "../utiles/WalletProvider";

export default function AllMyFiles() {
  const { address } = useContext(WalletContext);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [cid, setCid] = useState("");

  useEffect(() => {
    if (address) {
      getFilesCIDs();
    }
  }, [address]);

  const getFileFromPinata = async (e) => {
    if (!cid || !password) {
      return;
    }

    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    let file, salt;
    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) throw new Error("Failed to fetch file from IPFS");
      const resultJson = await response.json();
      const { filename, salt: extractedSalt, encrypted_data } = resultJson;
      salt = extractedSalt;
      const binaryData = Uint8Array.from(atob(encrypted_data), (c) =>
        c.charCodeAt(0)
      );
      file = new File([binaryData], filename, {
        type: "application/octet-stream",
      });
    } catch (err) {
      console.error("Error fetching or processing file from IPFS:", err);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);
    formData.append("salt", salt);
    try {
      const response = await fetch("http://localhost:5000/decrypt", {
        method: "POST",
        body: formData,
      });
      if (response.status !== 200) {
        alert("Decryption failed. Check password or file.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `decrypted_${file.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }

    window.location.reload();
  };

  const getFileInfo = async (cid) => {
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) throw new Error("Failed to fetch file from IPFS");
      const resultJson = await response.json();
      return {
        ...resultJson,
      };
    } catch (err) {
      console.error("Error fetching or processing file from IPFS:", err);
      return;
    }
  };

  const getFilesCIDs = async () => {
    try {
      const cids = await storeFile.methods.getFiles(address).call();

      const fileInfoArray = await Promise.all(
        cids.map(async (cid) => {
          const fileInfo = await getFileInfo(cid);
          return fileInfo ? { ...fileInfo, cid } : null;
        })
      );

      const validFiles = fileInfoArray.filter(Boolean);
      setFiles(validFiles);
    } catch (error) {
      console.error("Error fetching file CIDs or info:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="blockchain-data">
        {files.length === 0 ? (
          <div className="init-msg">
            <p>You haven't uploaded any files yet.</p>
          </div>
        ) : (
          <>
            <div className="section-info">
              <h2>Your Uploaded Files</h2>
              <p>Click on a file to decrypt and download it securely.</p>
            </div>
            <div className="file-cards-container">
              {files.map((file, index) => (
                <div
                  className="file-card"
                  key={index}
                  data-cid={file.cid}
                  onClick={() => {
                    setCid(file.cid);
                    setShowModal(true);
                  }}
                >
                  <strong>{file.filename}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter your secret key to download file</h3>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="model-btns">
              <button onClick={getFileFromPinata}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
