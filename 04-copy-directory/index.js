const fs = require('node:fs/promises');
const path = require('node:path');


fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

const copyDir = async () => {
  const files = await fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
  const copiedFiles = await fs.readdir(path.join(__dirname, 'files-copy'), {withFileTypes: true});
  copiedFiles.forEach((file) => {
    fs.unlink(path.join(__dirname, 'files-copy', file.name));
  });
  
  files.forEach((file) => {
    const copyFiles = async () => {
      try {
        await fs.copyFile((path.join(__dirname, 'files', file.name)), (path.join(__dirname, 'files-copy', file.name)));
      } catch {
        console.log('error');
      }
    };
    copyFiles();
  });
};

copyDir();