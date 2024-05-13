const fs = require("fs");
const cors = require("cors");
const express = require("express");

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('combined.json'); 
const middlewares = jsonServer.defaults();
// Add custom middleware for CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000 , http://localhost:3006'); // Allow any origin    
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.send('Réponse envoyée avec succès !');
  next();
});

server.use(router);
// server.listen(3000, () => {
//   console.log('JSON Server is running');
// });

const dbData = require("./selects_dataset/db.json");
const subscriberData = require("./selects_dataset/subscriber-step.json");
const vehicleData = require("./selects_dataset/vehicle-step.json");
const tiers = require("./selects_dataset/TIERS_API_BASE_URL.json")
const combinedData = { ...dbData, ...subscriberData, ...vehicleData, ...tiers };
/*
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000","http://localhost:3006","http://undefined:3046", "http://localhost:3046"],
  credentials: true , // Allow credentials
  optionSuccessStatus:200
};

app.use(cors(corsOptions));
*/

// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON bodies

// Serve the combined data as a JSON file
// app.get("/combined", (req, res) => {
//   res.json(combinedData);
// });

// Write combined data to file

fs.writeFileSync("./combined.json", JSON.stringify(combinedData, null, 2));

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const server = create();
// const router = _router(combinedData);
// const middlewares = jsonServer.defaults();

// Middleware to enable CORS
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from localhost:3000
//   res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
//   next();
// });

// server.use(cors());
// server.use(router);

// server.listen(3046, () => {
//   console.log("JSON Server is running on port 3046");
// });

// writeFileSync("./combined.json", JSON.stringify(combinedData, null, 2));
