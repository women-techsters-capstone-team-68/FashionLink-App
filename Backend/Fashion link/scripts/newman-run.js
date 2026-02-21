const fs = require('fs');
const path = require('path');
const newman = require('newman');

const collectionPath = path.join(__dirname, '..', 'postman_collection.json');
const envPath = path.join(__dirname, '..', 'postman_environment.json');
const dataPath = path.join(__dirname, '..', 'products_data.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function setEnvValue(envObj, key, value) {
  const vals = envObj.values || envObj.environment?.values || [];
  let found = false;
  for (let v of vals) {
    if (v.key === key) {
      v.value = String(value);
      found = true;
      break;
    }
  }
  if (!found) vals.push({ key, value: String(value), enabled: true });
  if (envObj.values) envObj.values = vals;
  else if (envObj.environment) envObj.environment.values = vals;
}

async function runAll() {
  const collection = loadJson(collectionPath);
  const baseEnv = loadJson(envPath);
  const data = loadJson(dataPath);

  for (const entry of data) {
    const envCopy = clone(baseEnv);
    // set common vars from the data entry
    for (const k of Object.keys(entry)) {
      setEnvValue(envCopy, k, entry[k]);
    }

    console.log('\n=== Running collection for productId=' + entry.productId + ' brand=' + entry.brand + ' ===');

    await new Promise((resolve, reject) => {
      newman.run({
        collection: collection,
        environment: envCopy,
        reporters: ['cli'],
        timeoutRequest: 120000
      }, function (err, summary) {
        if (err) {
          console.error('Newman run error:', err);
          return reject(err);
        }
        const failures = summary.run.failures || [];
        if (failures.length) {
          console.error('Failures for product', entry.productId, failures.map(f => f.error && f.error.message));
        } else {
          console.log('Run completed for product', entry.productId);
        }
        resolve();
      });
    });
  }
  console.log('\nAll runs completed.');
}

runAll().catch(err => {
  console.error(err);
  process.exit(1);
});
