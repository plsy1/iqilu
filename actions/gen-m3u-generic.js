const fs = require('fs');
const path = require("path");

const configPath = path.join(__dirname, '../', `config.json`);
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const baseUrl = config.baseUrl_generic.replace(/\/$/, '');
const blacklistNames = config.blacklistNames || [];
const blacklistOrgIds = config.blacklistOrgIds || [];

const dataPath = path.join(__dirname, '../data', `streams_all.json`);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const filtered = data.filter(item => {
  const name = item.name || '';
  const desc = item.desc || '';
  const nameOk = !blacklistNames.some(key => name.includes(key) || desc.includes(key));
  const idOk = !blacklistOrgIds.includes(item.orgId);
  return nameOk && idOk;
});

let m3u = '#EXTM3U\n';

filtered.forEach(item => {
  const logo = item.icon || (item.share && item.share.image) || '';
  const apiUrl = `${baseUrl}/api/iqilu?orgid=${item.orgId}&num=${item.index}`;
  m3u += `#EXTINF:-1 tvg-logo="${logo}",${item.name}\n`;
  m3u += `${apiUrl}\n`;
});

fs.writeFileSync('iqilu-generic.m3u', m3u, 'utf-8');
console.log('Filtered M3U generated: iqilu-generic.m3u');