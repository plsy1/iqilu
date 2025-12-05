const fs = require('fs');
const path = require('path');


const folder = path.join(__dirname, '../data');
const outputFile = path.join(__dirname, '../data/streams_all.json');

const files = fs.readdirSync(folder)
  .filter(file => /^streams_\d+-\d+\.json$/.test(file))
  .sort((a, b) => {
    const aStart = parseInt(a.match(/^streams_(\d+)-/)[1], 10);
    const bStart = parseInt(b.match(/^streams_(\d+)-/)[1], 10);
    return aStart - bStart;
  });

let merged = [];

for (const file of files) {
  const fullPath = path.join(folder, file);
  try {
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    if (Array.isArray(data)) {
      merged = merged.concat(data);
    } else {
      merged.push(data);
    }
    console.log(`Merged ${file} (${Array.isArray(data) ? data.length : 1} items)`);
  } catch (err) {
    console.log(`Failed to parse ${file}: ${err.message}`);
  }
}

fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`\nMerged ${files.length} files into ${outputFile}, total ${merged.length} items`);