import React, { useState } from "react";
import "../style/addFileForm.css";
import { CircularProgress } from "@mui/material";

export default function FetchFile() {
  const [Dpassword, setDPassword] = useState("");
  const [cid, setCid] = useState("");
  const [loading, setLoading] = useState(false);

  const getFileFromPinata = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!Dpassword || !cid) {
      setLoading(false);
      return;
    }

    console.log(cid + " " + Dpassword);

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
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", Dpassword);
    formData.append("salt", salt);

    try {
      const response = await fetch("http://localhost:5000/decrypt", {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        alert("Decryption failed. Check password or file.");
        setLoading(false);
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
    setLoading(false);
  };
  return (
    <div className="form-containe">
      <h2>Download File</h2>
      <form onSubmit={getFileFromPinata}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter CID"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter secret password"
            value={Dpassword}
            onChange={(e) => setDPassword(e.target.value)}
            required
          />
        </div>
        {loading ? (
          <button className="button" type="submit">
            <CircularProgress style={{ color: "white" }} />
          </button>
        ) : (
          <button className="button" type="submit">
            Decrypt
          </button>
        )}
      </form>
    </div>
  );
}
