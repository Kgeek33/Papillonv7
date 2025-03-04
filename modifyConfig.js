const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "app.config.ts");
let configContent = fs.readFileSync(configPath, "utf8");

configContent = configContent.replace(
  /name: "Papillon"/,
  "name: \"Papillon Dev\""
);
configContent = configContent.replace(
  /package: "xyz.getpapillon.app"/,
  "package: \"xyz.getpapillon.app.dev\""
);

fs.writeFileSync(configPath, configContent, "utf8");
console.log("app.config.ts modifié avec succès");
