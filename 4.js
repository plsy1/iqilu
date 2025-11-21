const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const blacklistNames = config.blacklistNames || [];
const blacklistOrgIds = config.blacklistOrgIds || [];

const data = JSON.parse(fs.readFileSync('streams_all.json', 'utf-8'));

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
  const apiUrl = item.stream;
  m3u += `#EXTINF:-1 tvg-logo="${logo}",${item.name}\n`;
  m3u += `${apiUrl}\n`;
});

fs.writeFileSync('iqilu-direct.m3u', m3u, 'utf-8');
console.log('Filtered M3U generated: iqilu-direct.m3u');