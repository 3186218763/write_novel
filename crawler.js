const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const PROXY = 'http://127.0.0.1:10090';
const BASE_URL = 'https://tw.hjwzw.com/Book/Read/50435,';
const OUTDIR = 'e:/Py_Project/novel/拆文库/魔法少女的骑士哥哥/原文';
const CHAPTER_LIST = 'e:/Py_Project/novel/chapter_list.txt';
const PROGRESS_FILE = path.join(OUTDIR, '_crawl_progress.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// Read chapter list
const lines = fs.readFileSync(CHAPTER_LIST, 'utf-8').trim().split('\n');
const chapters = lines.map(line => {
  const parts = line.split('\t');
  return { id: parts[1], title: parts[2] || `第${parts[1]}章` };
}).filter(ch => ch.id && ch.title);

console.log(`Total chapters: ${chapters.length}`);

// Load progress
let progress = { completed: [] };
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch(e) { /* ignore */ }
}

const completedSet = new Set(progress.completed);

function extractContent(html) {
  // Match the content div
  const match = html.match(/style="font-size: 20px; line-height: 30px[^>]*>([\s\S]*?)<\/div>/);
  if (!match) return '';

  let text = match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  // Clean domain reminders
  text = text.replace(/請記住本站域名.*?黃金屋\s*/g, '');
  text = text.replace(/魔法少女的騎士哥哥\s*第[^。]*。?\s*/g, '');

  return text;
}

function downloadChapter(id, title) {
  const safeTitle = (title || `ch_${id}`).replace(/[\\/:*?"<>|]/g, '_').substring(0, 80);
  const filename = path.join(OUTDIR, `${safeTitle}.txt`);

  if (fs.existsSync(filename) && fs.statSync(filename).size > 100) {
    return { status: 'skipped', file: filename };
  }

  try {
    const url = BASE_URL + id;
    const cmd = `curl -s --proxy ${PROXY} --connect-timeout 10 --max-time 20 -A "${USER_AGENT}" "${url}"`;
    const html = execSync(cmd, { timeout: 25000, encoding: 'utf-8' });

    const content = extractContent(html);
    if (content.length < 50) {
      return { status: 'empty', id };
    }

    fs.writeFileSync(filename, content, 'utf-8');
    return { status: 'downloaded', file: filename, size: content.length };
  } catch (err) {
    return { status: 'error', id, error: err.message };
  }
}

// Batch process: 5 concurrent downloads
async function main() {
  const BATCH_SIZE = 5;
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  let total = chapters.length;

  const toDownload = chapters.filter(ch => !completedSet.has(ch.id));

  console.log(`Already completed: ${completedSet.size}, To download: ${toDownload.length}`);

  for (let i = 0; i < toDownload.length; i += BATCH_SIZE) {
    const batch = toDownload.slice(i, i + BATCH_SIZE);
    const results = batch.map(ch => {
      const result = downloadChapter(ch.id, ch.title);
      return { ...result, ch };
    });

    for (const r of results) {
      if (r.status === 'downloaded') {
        downloaded++;
        completedSet.add(r.ch.id);
        console.log(`  ✓ [${downloaded + skipped + errors}/${total}] ${r.ch.title} (${r.size} chars)`);
      } else if (r.status === 'skipped') {
        skipped++;
        console.log(`  - [skipped] ${r.ch.title}`);
      } else if (r.status === 'empty') {
        errors++;
        console.log(`  ✗ [empty] ${r.ch.title} (ID: ${r.id})`);
      } else {
        errors++;
        console.log(`  ✗ [error] ${r.ch.title}: ${r.error}`);
      }
    }

    // Save progress every batch
    progress.completed = Array.from(completedSet);
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');

    // Small delay between batches
    if (i + BATCH_SIZE < toDownload.length) {
      execSync('sleep 0.5');
    }
  }

  console.log(`\n=== Crawl Complete ===`);
  console.log(`Total: ${total} | Downloaded: ${downloaded} | Skipped: ${skipped} | Errors: ${errors}`);
}

main().catch(console.error);
