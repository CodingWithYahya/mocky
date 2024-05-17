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

fs.writeFileSync("./combined.json", '');

const dbData = require("./selects_dataset/db.json");

//-------------------------------------------------------------------------------

// Pour obtenir les sous-types d'un type d'usage : GET /{typeUsage}
// Pour obtenir les genres d'un sous-type donné : GET /{typeUsage}/{sousType}/genres
// Pour obtenir les types d'immatriculation d'un sous-type donné : GET /{typeUsage}/{sousType}/immatriculation

// Analyse des données pour identifier les types d'usage et leurs sous-types
const usageTypes = Object.keys(dbData.ALL);
console.log("🚀 ~ usageTypes:", usageTypes)

// Définition des routes dynamiques pour chaque type d'usage
usageTypes.forEach(usageType => {
  const subTypes = dbData.ALL[usageType].map(subType => subType.libelle);
  console.log("🚀 ~ subTypes:", subTypes)

  // Endpoint pour récupérer les sous-types d'un type d'usage donné 
  server.get(`/${usageType}`, (req, res) => {
    console.log("req",JSON.stringify(req));
    
    res.json(subTypes);
  });

  // Endpoint pour récupérer les genres d'un sous-type donné
  server.get(`/${usageType}/:subType/genres`, (req, res) => {
    const subType = req.params.subType;
    const genres = dbData.ALL[usageType].find(item => item.libelle === subType)?.genre || [];
    res.json(genres);
  });

  // Endpoint pour récupérer les types d'immatriculation d'un sous-type donné
  server.get(`/${usageType}/:subType/immatriculation`, (req, res) => {
    const subType = req.params.subType;
    const immatriculation = dbData.ALL[usageType].find(item => item.libelle === subType)?.typeImmatriculation || [];
    res.json(immatriculation);
  });
});
//-------------------------------------------------------------------------------
// const subscriberData = require("./selects_dataset/subscriber-step.json");
// const vehicleData = require("./selects_dataset/vehicle-step.json");
// const tiers = require("./selects_dataset/TIERS_API_BASE_URL.json");
// const mono = require("./selects_dataset/MONO_API_BASE_URL.json");
// const auth = require("./selects_dataset/AUTH_BASE_URL.json");
const combinedData = { ...dbData /* , ...subscriberData, ...vehicleData, ...tiers, ...auth, ...mono */ };

fs.writeFileSync("./combined.json", JSON.stringify(combinedData, null, 2));
