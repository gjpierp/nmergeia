const fs = require('fs');
const file = 'C:/Local/nmerge/public/locales/es/translation.json';
let d = fs.readFileSync(file, 'utf8');
d = d.replace(/"CAT_NMERGEIA_N4_TEMAS":\s*".*"/g, '"CAT_NMERGEIA_N4_TEMAS": "Biblioteca Técnica"');
fs.writeFileSync(file, d, 'utf8');
console.log('Fixed');
