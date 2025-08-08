const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();
const PORT = 5000; // Port where this server runs

// Load your client cert files
const certOptions = {
  key: fs.readFileSync("client-key.pem"),
  cert: fs.readFileSync("client-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem") // optional if using a trusted CA
};

// Proxy endpoint
app.get("/api/jobs", (req, res) => {
  const options = {
    hostname: "your-api-domain.com",
    port: 443,
    path: "/jobs",
    method: "GET",
    ...certOptions
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";
    apiRes.on("data", chunk => data += chunk);
    apiRes.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch {
        res.send(data);
      }
    });
  });

  apiReq.on("error", (err) => {
    console.error("Error calling API:", err);
    res.status(500).json({ error: err.message });
  });

  apiReq.end();
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
