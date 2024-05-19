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
server.use(middlewares)

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000 , http://localhost:3006'); // Allow any origin    
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.send('Réponse envoyée avec succès !');
  next();
});

// server.use(router);

fs.writeFileSync("./combined.json", '');

//const dbData = require("./selects_dataset/db.json");
// Dynamic route handling for usage types and sub-types
const dbData = JSON.parse(fs.readFileSync("./selects_dataset/db.json", "utf-8"));

//-------------------------------------------------------------------------------
// Pour obtenir les sous-types d'un type d'usage : GET /{typeUsage}
// Pour obtenir les genres d'un sous-type donné : GET /{typeUsage}/{sousType}/genres
// Pour obtenir les types d'immatriculation d'un sous-type donné : GET /{typeUsage}/{sousType}/immatriculation

// Analyse des données pour identifier les types d'usage et leurs sous-types
/*🚀
const usageTypes = Object.keys(dbData.ALL);
console.log("🚀 ~ usageTypes:", usageTypes)

// Définition des routes dynamiques pour chaque type d'usage
usageTypes.forEach(usageType => {
  const subTypes = dbData.ALL[usageType].map(subType => subType.libelle);
  console.log("🚀 ~ subTypes:", subTypes)

  // Endpoint pour récupérer les sous-types d'un type d'usage donné 
  server.get(`/referentiel/api/usage-vehicule/:usageType`, (req, res) => {
    const { usageType } = req.params;
    const subTypes = dbData.ALL[usageType].map(subType => subType.libelle);
    
    console.log("req",JSON.stringify(req));
    console.log("🚀 ~ req :", req )
    console.log("🚀 ~ res :", res )
    console.log("🚀 ~ usageType :", usageType )
    res.json(subTypes);
  });

  // Endpoint pour récupérer les genres d'un sous-type donné
  server.get(`/referentiel/api/usage-vehicule/:usageType/:subType/genres`, (req, res) => {
    const { usageType, subType } = req.params;
    //const subType = req.params.subType;
    const genres = dbData.ALL[usageType].find(item => item.libelle === subType)?.genre || [];
    console.log("🚀 ~ genres :", genres )
    res.json(genres);
  });

  // Endpoint pour récupérer les types d'immatriculation d'un sous-type donné
  server.get(`/referentiel/api/usage-vehicule/:usageType/:subType/immatriculation`, (req, res) => {
    const { usageType, subType } = req.params;
    //const subType = req.params.subType;
    const immatriculation = dbData.ALL[usageType].find(item => item.libelle === subType)?.typeImmatriculation || [];
    console.log("🚀 ~ immatriculation :", immatriculation )
    res.json(immatriculation);
  });
});
🚀*/
//-------------------------------------------------------------------------------

// const mono = require("./selects_dataset/MONO_API_BASE_URL.json");
const combinedData = { ...dbData /*...mono*/ };

fs.writeFileSync("./combined.json", JSON.stringify(combinedData, null, 2));

// Helper function to get nested data
const getNestedData = (data, keys) => {
  return keys.reduce((obj, key) => {
    if (Array.isArray(obj)) {
      return obj.map(item => item[key]).flat();
    }
    return obj && obj[key] !== undefined ? obj[key] : null;
  }, data);
};

// Create dynamic routes for each key in ALL
const dynamicDb = combinedData.USAGESTUFF;
Object.keys(dynamicDb).forEach(key => {
  server.get(`/USAGESTUFF/${key}`, (req, res) => {
    res.json(dynamicDb[key]);
  });

  server.get(`/USAGESTUFF/${key}/*`, (req, res) => {
    const subPath = req.params[0].split('/');
    console.log("🚀 ~ server.get ~ subPath:", subPath)
    const nestedData = getNestedData(dynamicDb[key], subPath);
    if (nestedData) {
      res.json(nestedData);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  });
});

// Use the JSON Server router after defining the dynamic routes
server.use(router);

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});