const fs = require('node:fs/promises');
const path = require('node:path');


const getNames = async () => {
  const files = await fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
  files.forEach((file) => {
    if (file.isFile()) {
      let dotPos = file.name.lastIndexOf('.');
      let pathToFile = path.join(__dirname, 'secret-folder' ,file.name);
      const getStats = async function () {
        let st = await fs.stat(pathToFile);
        console.log(file.name.slice(0, dotPos) + ' - ' + path.extname(file.name).slice(1) + ' - ' + st.size + 'b');
      };
      getStats();
      
      
    }
  });
};

getNames();