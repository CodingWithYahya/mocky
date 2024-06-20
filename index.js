const fs = require("fs");
const cors = require("cors");
const express = require("express");
const jsonServer = require('json-server');
require('dotenv').config(); // Charger les variables d'environnement à partir de .env

const server = jsonServer.create();
const router = jsonServer.router('combined.json'); 
const middlewares = jsonServer.defaults();

// Charger les routes personnalisées depuis routes.json
const customRoutes = JSON.parse(fs.readFileSync('routes.json'));

server.use(jsonServer.rewriter(customRoutes));
// server.use(cors());

server.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3006', 'http://localhost:3000/souscription'],
  credentials: true,
}));
server.use(middlewares);

server.use((req, res, next) => {
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.send('Réponse envoyée avec succès !');
  next();
});

fs.writeFileSync("./combined.json", '');

//const dbData = require("./selects_dataset/db.json");
// Dynamic route handling for usage types and sub-types
const dbData = JSON.parse(fs.readFileSync("./selects_dataset/db.json", "utf-8"));
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

// 🚀🚀 Fonction helper pour trouver un élément par code
const findItemByCode = (data, code) => {
  for (const key in data) {
    const items = data[key];
    if (Array.isArray(items)) {
      const item = items.find(item => item.code === code);
      if (item) {
        return item;
      }
    }
  }
  return null;
};
// 🚀🚀 Créer la route dynamique pour GenreByUsageVehiculeCode
server.get('/GenreByUsageVehiculeCode/:code', (req, res) => {
  const { code } = req.params;
  const items = combinedData.USAGESTUFF;
  const item = findItemByCode(items, code);
  if (item && item.genre) {
    res.json(item.genre);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

server.get('/ImmatriculationByUsageVehiculeCode/:code', (req, res) => {
  const { code } = req.params;
  const items = combinedData.USAGESTUFF;
  const item = findItemByCode(items, code);
  if (item && item.typeImmatriculation) {
    res.json(item.typeImmatriculation);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

server.get('/puissanceFiscByUsageVehiculeCode/:code', (req, res) => {
  const { code } = req.params;
  const item = combinedData.puissancesFiscalesDB.find(item => item.code === code);
  // console.log("🚀 ~ server.get ~ items:", items)
  //const item = findItemByCode(items, code);
  // console.log("🚀 ~ server.get ~ item:", item)
  if (item/* && item.puissancesFiscales*/) {
    res.json(item.puissancesFiscales);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

// 🚀🚀 Helper function to find an item by ID
const findItemById = (items, id) => {
  return items.find(item => item.id === parseInt(id));
};
// 🚀🚀 Create dynamic routes for each key in ALL
const dynamicDb = combinedData.USAGESTUFF;
Object.keys(dynamicDb).forEach(key => {
  server.get(`/USAGESTUFF/${key}`, (req, res) => {
    res.json(dynamicDb[key]);
  });

  server.get(`/USAGESTUFF/${key}/:id`, (req, res) => {
    const { id } = req.params;
    const item = findItemById(dynamicDb[key], id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  });

  server.get(`/USAGESTUFF/${key}/:id/genre`, (req, res) => {
    const { id } = req.params;
    const item = findItemById(dynamicDb[key], id);
    if (item && item.genre) {
      res.json(item.genre);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  });

  server.get(`/USAGESTUFF/${key}/:id/typeImmatriculation`, (req, res) => {
    const { id } = req.params;
    const item = findItemById(dynamicDb[key], id);
    if (item && item.typeImmatriculation) {
      res.json(item.typeImmatriculation);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
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


server.use(router);

const PORT = process.env.PORT;
console.log("🚀 ~ PORT:", PORT)
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});



/*
pas de provisoire = 
------ 
,
        {
            "code": 2,
            "label": "PROVISOIRE"
        }
*/