// import React, { useState } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const QRScanner = () => {
//   const [scanResult, setScanResult] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleScan = (data) => {
//     if (data === "GE_APPLIANCES") {
//       setIsModalOpen(true);
//     }
//     // if (data) {
//     //   setScanResult(data);
//     //   socket.emit("joinQueue", { name: data });
//     // }
//   };

//   // const handleScan = (result: IDetectedBarcode[]) => {
//   //   if (result) {
//   //     console.log(result);
//   //     // Redirect to /choice path
//   //     router.push(`/choice?${result[0].rawValue}`);
//   //   }
//   // };

//   return (
//     <div>
//       <h2>Scan QR Code to Join Queue</h2>
//       <Scanner onScan={(result) => console.log(result)} />
//       <p>Scanned: {scanResult}</p>

//       {/* Modal */}
//       {isModalOpen && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <h3>Success</h3>
//             <p>You've scanned GE_APPLIANCES!</p>
//             <button onClick={() => setIsModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Inline styles for modal
// const styles = {
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     background: "white",
//     padding: "20px",
//     borderRadius: "8px",
//     textAlign: "center",
//   },
// };

// export default QRScanner;
