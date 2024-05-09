const fs = require('fs');

const dbData = require('./selects_dataset/db.json');
const subscriberData = require('./selects_dataset/subscriber-step.json');
const vehicleData = require('./selects_dataset/vehicle-step.json');
const combinedData = { ...dbData, ...subscriberData, ...vehicleData };

fs.writeFileSync('./combined.json', JSON.stringify(combinedData, null, 2));
