import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { WalletContext } from "../utiles/WalletProvider";
import axios from "axios";
import storeFile from "../storeFile";
import "../style/addFileForm.css";
import Navbar from "./navBar";

export default function AddFileForm() {
  const { address } = useContext(WalletContext);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    let buffer;
    setLoading(true);

    if (!file || !password.trim()) {
      setError("Please select a file and enter a password");
      setLoading(false);
      return;
    }

    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5000/encrypt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to encrypt file");

      const encryptedBlob = await response.blob();
      const arrayBuffer = await encryptedBlob.arrayBuffer();
      buffer = new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error("Encryption failed:", error);
      setError("Encryption failed : ", error);
      setLoading(false);
      return;
    }

    const encryptedFile = new File([buffer], `encrypted_${file.name}`, {
      type: file.type,
    });

    try {
      const sendData = new FormData();
      sendData.append("file", encryptedFile);

      const resp = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        sendData,
        {
          headers: {
            pinata_api_key: "e47fc300a8b87a0dd09e",
            pinata_secret_api_key:
              "084a1d3eb9eda22b169686ba10438909dca643220358a3d6326d9f0bf0e92f92",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const CID = resp.data.IpfsHash;
      if (!CID) {
        setLoading(false);
        return;
      }

      await storeFile.methods.addFile(CID).send({ from: address });
      console.log(`File uploaded to blockchain with CID: ${CID}`);
    } catch (error) {
      setLoading(false);
      setError(
        "Something went wrong while uploading the file to the blockchain. ",
        error
      );
      return;
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <h2>Upload File</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Select file :</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter secret password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loading ? (
            <button className="button" type="submit">
              <CircularProgress style={{ color: "white" }} />
            </button>
          ) : (
            <button className="button" type="submit">
              Upload
            </button>
          )}
        </form>
        <div className="error-msg">{error && <p>{error}</p>}</div>

        <hr />
      </div>
    </div>
  );
}
