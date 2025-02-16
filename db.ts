const fs = require("fs/promises");
const path = require("path");

console.log(process.env.DB_URL);
console.log(path.resolve(process.env.DB_URL));
