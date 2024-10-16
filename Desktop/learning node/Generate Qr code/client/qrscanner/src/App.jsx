// import  { useState } from "react";
// import axios from "axios";

// function App() {
//   const [url, setUrl] = useState("");
//   const [qrcode, setQrcode] = useState("");

//   const generateQRCode = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/qrcodes/generate",
//         { url }
//       );
//       console.log("respnse",response)
//       setQrcode(response.data.data);
//     } catch (err) {
//       console.error("Error generating QR code", err);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>QR Code Generator</h1>
//       <input
//         type="text"
//         value={url}
//         onChange={(e) => setUrl(e.target.value)}
//         placeholder="Enter URL"
//       />
//       <button onClick={generateQRCode}>Generate QR Code</button>

//       {qrcode && <img src={qrcode} alt="Generated QR Code" />}
//     </div>
//   );
// }

// export default App;
// working perfect

// import { useState } from "react";

// function App() {
//   const [qrCodeUrl, setQrCodeUrl] = useState("");

// const generateQRCode = async () => {
//   try {
//     // Get the current tab's URL
//     const [tab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });

//     // Check if a tab is available and if it has a URL
//     if (!tab || !tab.url) {
//       console.error("No active tab found or it does not have a URL.");
//       return;
//     }

//     // Send the URL to the backend and get the QR code
//     const response = await fetch("http://localhost:8000/api/qrcodes/generate", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ url: tab.url }),
//     });

//     // Check if the response is successful
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data);

//     // Check if the expected data is in the response
//     if (data && data.data) {
//       setQrCodeUrl(data.data); // Assuming API returns the QR code image URL
//     } else {
//       console.error("Unexpected response format:", data);
//     }
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//   }
// };

//   return (
//     <div className="App">
//       <h1>QR Code Generator</h1>
//       <button onClick={generateQRCode}>Generate QR Code</button>
//       {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
//     </div>
//   );
// }

// export default App;
//end working perfect
// tyring new
import { useState } from "react";
function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.url) {
        console.error("No active tab found or it does not have a URL.");
        return;
      }

    const response = await fetch(
      "https://qr-backend-1hvy.vercel.app/?vercelToolbarCode=fwaV-B2Gp9l7mo-/api/qrcodes/generate", // Updated to your Vercel deployment URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: tab.url }), // Send the URL to be converted to a QR code
      }
    );


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data && data.data) {
        setQrCodeUrl(data.data);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const shareQrCode = async () => {
    if (qrCodeUrl) {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "qrcode.png"; // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], "qrcode.png", { type: blob.type });

        await navigator.share({
          files: [file],
          title: "Check out this QR Code!",
          text: "Scan this QR Code to access the link!",
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>QR Code Generator</h1>
      <button onClick={generateQRCode}>Generate QR Code</button>
      {qrCodeUrl && (
        <>
          <img src={qrCodeUrl} alt="QR Code" />
          <button onClick={shareQrCode}>Download/Share QR Code</button>
        </>
      )}
    </div>
  );
}

export default App;
