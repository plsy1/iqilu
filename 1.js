const https = require("https");
const fs = require("fs");
const path = require("path");

const BATCH_SIZE = 100;
const MAX_ORGID = 700;

async function fetchOrgId(orgId) {
  return new Promise((resolve) => {
    const url = `https://app.litenews.cn/v1/app/play/tv/live?orgid=${orgId}`;
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.data && Array.isArray(json.data)) {
              const validStreams = json.data
                .filter((item) => item.stream && item.stream.startsWith("http"))
                .map((item, i) => {
                  item.stream = item.stream.replace(/\s/g, "");
                  return { orgId, index: i, ...item };
                });
              resolve(validStreams);
            } else {
              resolve([]);
            }
          } catch (err) {
            console.log(`orgId ${orgId} JSON parse error`);
            resolve([]);
          }
        });
      })
      .on("error", (err) => {
        console.log(`orgId ${orgId} request error: ${err.message}`);
        resolve([]);
      });
  });
}

async function fetchBatch(start, end) {
  console.log(`\n=== Starting batch ${start}-${end} ===`);
  const results = [];
  for (let orgId = start; orgId <= end; orgId++) {
    const streams = await fetchOrgId(orgId);
    if (streams.length > 0) {
      results.push(...streams);
      console.log(`Fetched orgId ${orgId}, got ${streams.length} valid streams`);
    } else {
      console.log(`Fetched orgId ${orgId}, no valid streams`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  const outputFile = path.join(__dirname, 'data', `streams_${start}-${end}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf-8");
  console.log(`Batch ${start}-${end} done! ${results.length} total streams saved to ${outputFile}`);
}

async function fetchAllBatches() {
  for (let start = 1; start <= MAX_ORGID; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, MAX_ORGID);
    await fetchBatch(start, end);
  }
  console.log("\n=== All batches completed ===");
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}


fetchAllBatches();
