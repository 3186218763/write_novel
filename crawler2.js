const fs = require('fs');
const https = require('https');
const path = require('path');

const BOOK_ID = '196122';
const BASE_URL = `https://025.bqg606.cc/api/chapter?id=${BOOK_ID}&chapterid=`;
const OUTDIR = 'e:/Py_Project/novel/拆文库/魔法少女的骑士哥哥/原文';
const PROGRESS_FILE = path.join(OUTDIR, '_crawl_progress.json');
const CHAPTER_LIST_FILE = path.join(OUTDIR, '_章节索引.txt');

// Ensure output dir exists
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

// Load progress
let progress = { completed: [], total: 0 };
if (fs.existsSync(PROGRESS_FILE)) {
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) {}
}
const completedSet = new Set(progress.completed.map(String));

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode}`));
        else resolve(data);
      });
    }).on('error', reject);
  });
}

async function downloadChapter(chapterId) {
  const sid = String(chapterId);
  if (completedSet.has(sid)) return { status: 'skipped', id: chapterId };

  try {
    const json = await httpGet(BASE_URL + chapterId);
    const data = JSON.parse(json);

    if (!data.txt) return { status: 'empty', id: chapterId };

    const name = data.chaptername || `第${chapterId}章`;
    const safeName = `ch${String(chapterId).padStart(4, '0')}_${name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 60)}`;
    const filename = path.join(OUTDIR, `${safeName}.txt`);

    // Save just the clean text
    fs.writeFileSync(filename, data.txt, 'utf-8');

    return {
      status: 'downloaded',
      id: chapterId,
      name,
      size: data.txt.length,
      filename,
      totalChapters: data.cs
    };
  } catch (err) {
    return { status: 'error', id: chapterId, error: err.message };
  }
}

async function main() {
  // First, get total chapter count from chapter 1
  console.log('Fetching chapter info...');
  const initData = JSON.parse(await httpGet(BASE_URL + '1'));
  const totalChapters = parseInt(initData.cs);
  progress.total = totalChapters;
  console.log(`Total chapters: ${totalChapters}`);

  // Build chapter index
  const chapterIndex = [];

  // Download all chapters in batches
  const BATCH = 10;
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 1; i <= totalChapters; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, totalChapters + 1); j++) {
      batch.push(j);
    }

    const results = await Promise.all(batch.map(id => downloadChapter(id)));

    for (const r of results) {
      if (r.status === 'downloaded') {
        downloaded++;
        completedSet.add(String(r.id));
        chapterIndex.push({ id: r.id, name: r.name, file: r.filename });
        const pct = ((downloaded + skipped + errors) / totalChapters * 100).toFixed(1);
        process.stdout.write(`\r  ✓ ${r.name} (${r.size} chars) [${pct}%]`);
      } else if (r.status === 'skipped') {
        skipped++;
      } else {
        errors++;
        console.log(`\n  ✗ Chapter ${r.id}: ${r.error}`);
      }
    }

    // Save progress
    progress.completed = Array.from(completedSet);
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
  }

  // Write chapter index
  const indexLines = chapterIndex
    .sort((a, b) => a.id - b.id)
    .map(c => `${c.id}\t${c.name}\t${c.file}`)
    .join('\n');
  fs.writeFileSync(CHAPTER_LIST_FILE, indexLines, 'utf-8');

  console.log(`\n\n=== Crawl Complete ===`);
  console.log(`Total: ${totalChapters} | Downloaded: ${downloaded} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log(`Output: ${OUTDIR}`);
}

main().catch(console.error);
