// This script updates PACKAGE_VERSION and LAST_BUILD_TIME in version.ts from package.json and current time.
const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'src', 'version.ts');
const packageJsonFile = path.join(__dirname, 'package.json');
const now = new Date().toISOString();

const pkg = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
const version = pkg.version;

let content = fs.readFileSync(versionFile, 'utf8');
content = content.replace(
  /export const PACKAGE_VERSION = ".*"/,
  `export const PACKAGE_VERSION = "${version}"`
);
content = content.replace(
  /export const LAST_BUILD_TIME = ".*"/,
  `export const LAST_BUILD_TIME = "${now}"`
);
fs.writeFileSync(versionFile, content);
console.log(`PACKAGE_VERSION set to ${version}`);
console.log(`LAST_BUILD_TIME set to ${now}`);
// ...existing code...
