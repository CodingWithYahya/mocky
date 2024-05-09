const fs = require('fs');

const dbData = require('./db.json');
const subscriberData = require('./subscriber-step.json');

const combinedData = { ...dbData, ...subscriberData };

fs.writeFileSync('./combined.json', JSON.stringify(combinedData, null, 2));
