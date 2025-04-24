const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import web3 from "./web3";
// import storeFile from "./storeFile";

// export default function AddFileForm() {
//   const [address, setAddress] = useState("");
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [Dpassword, setDPassword] = useState("");
//   const [cid, setCid] = useState("");
//   const [blockchainData, setBlockchainData] = useState([]);

//   useEffect(() => {
//     const loadAccounts = async () => {
//       if (window.ethereum) {
//         try {
//           await window.ethereum.request({ method: "eth_requestAccounts" }); // prompt wallet
//           const addr = await web3.eth.getAccounts();
//           setAddress(addr[0]);
//           // console.log("Accounts:", accounts);
//         } catch (err) {
//           console.error("User denied account access or error occurred:", err);
//         }
//       } else {
//         console.log("Please install MetaMask!");
//       }
//     };

//     loadAccounts();
//     console.log("Updated blockchainData:", blockchainData);
//   }, [blockchainData]);

//   const getBCData = async () => {
//     console.log("In getting process");
//     try {
//       const data = await storeFile.methods.getFiles(address).call();
//       setBlockchainData(data);
//       // console.log(blockchainData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     let buffer;

//     if (!file || !password) {
//       alert("Please select a file and enter a password");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("password", password);

//     try {
//       const response = await fetch("http://localhost:5000/encrypt", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to encrypt file");
//       }
//       const encryptedBlob = await response.blob();

//       const arrayBuffer = await encryptedBlob.arrayBuffer();
//       buffer = new Uint8Array(arrayBuffer); // or Buffer.from(arrayBuffer) in Node
//     } catch (error) {
//       console.error("Encryption failed:", error);
//       return;
//     }

//     const encryptedFile = new File(
//       [buffer], // contents
//       `encrypted_${file.name}`, // file name
//       { type: file.type } // preserve original MIME type
//     );

//     try {
//       console.log("In sending process");
//       const sendData = new FormData();
//       sendData.append("file", encryptedFile);
//       const resp = await axios({
//         method: "post",
//         url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         data: sendData,
//         headers: {
//           pinata_api_key: "e47fc300a8b87a0dd09e",
//           pinata_secret_api_key:
//             "084a1d3eb9eda22b169686ba10438909dca643220358a3d6326d9f0bf0e92f92",
//           "Content-Type": "multiple/form-data",
//         },
//       });

//       const CID = resp.data.IpfsHash;

//       if (!CID) {
//         console.log("Error while uploading file on ipfs, no CID");
//         return;
//       }

//       await storeFile.methods.addFile(CID).send({ from: address });
//       console.log("Upload done on blockchain : " + CID);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getFileFromPinata = async (e) => {
//     e.preventDefault();
//     if (!Dpassword || !cid) {
//       console.log("No CID and password");
//       return;
//     }

//     const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

//     let file;
//     let saltttt;
//     try {
//       const response = await fetch(gatewayUrl);
//       if (!response.ok) {
//         throw new Error("Failed to fetch file from IPFS");
//       }

//       const resultJson = await response.json();

//       const { filename, salt, encrypted_data } = resultJson;
//       saltttt = salt;

//       // Convert encrypted_data back to binary
//       const binaryData = Uint8Array.from(atob(encrypted_data), (c) =>
//         c.charCodeAt(0)
//       );

//       // Create a File object
//       file = new File([binaryData], filename, {
//         type: "application/octet-stream",
//       });

//       console.log("Reconstructed file object:", file);
//     } catch (err) {
//       console.error("Error fetching or processing file from IPFS:", err);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("password", Dpassword);
//     formData.append("salt", saltttt);

//     formData.forEach((value, key) => {
//       console.log("FormData:", key, value);
//     });

//     const response = await fetch("http://localhost:5000/decrypt", {
//       method: "POST",
//       body: formData,
//     });

//     if (response.status !== 200) {
//       alert("Decryption failed. Check password or file.");
//       return;
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `decrypted_${file.name}`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <div>
//           <label>Select file : </label>
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         </div>
//         <input
//           type="password"
//           placeholder="Enter secret password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Upload</button>
//       </form>
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <form onSubmit={getFileFromPinata}>
//         <input
//           type="CID"
//           placeholder="Enter CID"
//           value={cid}
//           onChange={(e) => setCid(e.target.value)}
//           required
//         />
//         <br />
//         <input
//           type="password"
//           placeholder="Enter secret password"
//           value={Dpassword}
//           onChange={(e) => setDPassword(e.target.value)}
//           required
//         />
//         <br />
//         <button type="submit">Upload</button>
//       </form>
//       <br />
//       <br />
//       <br />
//       <button onClick={getBCData}>BlockChain Data</button>
//       <br />
//       {blockchainData.length === 0 ? (
//         <div>No file on blockchain</div>
//       ) : (
//         <ul>
//           {blockchainData.map((fileCID, index) => (
//             <li key={index}>{fileCID}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
