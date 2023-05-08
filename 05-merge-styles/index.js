const fsP= require('node:fs/promises');
const path = require('node:path');
const fs = require('node:fs');


const streamPromises = [];
let stylesArr = [];

const createBundle = async () => {
  const files = await fsP.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  files.forEach((file) => {
    if (file.isFile() && file.name.slice(-3) == 'css') {
      streamPromises.push(promisifyStream(fs.createReadStream(path.join(__dirname, 'styles', file.name), {encoding: 'utf-8'})));
    }
  });
  Promise.all(streamPromises)
    .then(() => {
      fs.writeFile(path.resolve(__dirname, 'project-dist','bundle.css'), stylesArr.join(''), () => {
      });
    });
};

function promisifyStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => {
      stylesArr.push(chunk);
    });
    stream.on('end', () => {
      resolve();
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

createBundle();