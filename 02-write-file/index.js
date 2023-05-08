const readline = require('node:readline');
const path = require('node:path');
const fs = require('node:fs');
const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

fs.writeFile(path.resolve(__dirname, 'text.txt'), '', () => {

});

console.log('Что положить в файл?');

rl.on('line', (input) => {
  if (input != 'exit') {
    fs.appendFile(path.resolve(__dirname, 'text.txt'), input, () => {
    });
  } else {
    console.log('Файл успешно отредактирован, до свидания!');
    process.exit();
  }
  

});

rl.on('SIGINT', () => {
  console.log('Файл успешно отредактирован, до свидания!');
  process.exit();
});




