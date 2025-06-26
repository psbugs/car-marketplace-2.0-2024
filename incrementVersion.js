const fs = require("fs");

const path = "./src/version.json";

const versionData = JSON.parse(fs.readFileSync(path, "utf8"));
let [major, minor, patch] = versionData.APP_VERSION.split(".").map(Number);

patch++;

if (patch > 9) {
  patch = 0;
  minor++;
}

if (minor > 9) {
  minor = 0;
  major++;
}

const newVersion = `${major}.${minor}.${patch}`;
versionData.APP_VERSION = newVersion;

fs.writeFileSync(path, JSON.stringify(versionData, null, 2));
console.log(`✅ Incremented app version to ${newVersion}`);
