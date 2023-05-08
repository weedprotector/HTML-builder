const path = require('node:path');
const fs = require('node:fs');

const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath, {encoding: 'utf-8'});

stream.on('data', (data) =>
  console.log(data)
);

