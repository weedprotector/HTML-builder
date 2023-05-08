const createReadStream = require('fs').createReadStream;
const fs =require('fs').promises; 
const path = require('path');

const ENCODING = 'utf-8';
const paths = {
  src: {
    html: path.join(__dirname, 'template.html'),
    assets: path.join(__dirname, 'assets'),
    styles: path.join(__dirname, 'styles'),
    components: path.join(__dirname, 'components'),
  },
  dist: {
    bundle: path.join(__dirname, 'project-dist'),
    assets: path.join(__dirname, 'project-dist', 'assets'),
    css: path.join(__dirname, 'project-dist', 'bundle.css')
  }
};

const readeableStream = createReadStream(paths.src.html, ENCODING);

readeableStream.on('data', (data) => {
  let templateData = data;
  const streamsPromises = [];
  const componentsMatches = getComponentsMatches(data);
  componentsMatches.forEach((name) => {
    streamsPromises.push(promisifiedStream(createReadStream(path.join(paths.src.components, `${name}.html`), ENCODING)));
  });
  Promise.all(streamsPromises).then(data => {
    componentsMatches.forEach((name, i) => {
      templateData = templateData.replace(`{{${name}}}`, data[i]);
    });
    fs.mkdir(paths.dist.bundle, { recursive: true }).then(() => {
      createHTMLBundle(templateData);
      createAssetsBundle();
      createStylesBundle();
    });
  });
});

function createHTMLBundle(html) {
  fs.writeFile(path.resolve(paths.dist.bundle, 'index.html'), html);
}

function createAssetsBundle() {
  fs.mkdir(paths.dist.assets, { recursive: true }).then(async () => {
    const files = await fs.readdir(paths.src.assets, {withFileTypes: true});
    files.forEach((file) => {
      copyDir(path.join(paths.src.assets, file.name), path.join(paths.dist.assets, file.name));
    });
  });
}

async function createStylesBundle() {
  const streamsPromises = [];
  const files = await fs.readdir(paths.src.styles);
  files.forEach(name => {
    streamsPromises.push(promisifiedStream(createReadStream(path.join(paths.src.styles, name), ENCODING)));
  });
  Promise.all(streamsPromises).then((data => {
    fs.writeFile(paths.dist.css, data.join(''));
  }));
}

async function copyDir(src, dest) {
  try {
    await fs.access(dest);
  } catch (error) {
    await fs.mkdir(dest);
  }

  const entries = await fs.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function getComponentsMatches(data) {
  const regex = /\{\{\s*(\w+)\s*\}\}/g;
  const matches = data.matchAll(regex);
  return Array.from(matches, m => m[1]);
}   

const promisifiedStream = (stream) => {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => resolve(data));
    stream.on('error', error => reject(error));
  });
};