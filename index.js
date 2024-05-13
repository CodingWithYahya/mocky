const fs = require("fs");
const cors = require("cors");
const express = require("express");

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('combined.json'); 
const middlewares = jsonServer.defaults();

// Charger les routes personnalisées depuis routes.json
const customRoutes = JSON.parse(fs.readFileSync('routes.json'));
server.use(jsonServer.rewriter(customRoutes));
server.use(cors());


server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000 , http://localhost:3006'); // Allow any origin    
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.send('Réponse envoyée avec succès !');
  next();
});

server.use(router);
server.use(middlewares)

const dbData = require("./selects_dataset/db.json");
const subscriberData = require("./selects_dataset/subscriber-step.json");
const vehicleData = require("./selects_dataset/vehicle-step.json");
const tiers = require("./selects_dataset/TIERS_API_BASE_URL.json");
const mono = require("./selects_dataset/MONO_API_BASE_URL.json");
const auth = require("./selects_dataset/AUTH_BASE_URL.json");
const combinedData = { ...dbData, ...subscriberData, ...vehicleData, ...tiers, ...auth, ...mono };

fs.writeFileSync("./combined.json", JSON.stringify(combinedData, null, 2));
