import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

export let usingMongo = false;

export async function connectDb() {
  const uri = process.env.MONGODB_URI?.trim();
  if (uri) {
    await mongoose.connect(uri);
    usingMongo = true;
    console.log('[db] connected to MongoDB');
    return;
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ feedbacks: [] }, null, 2));
  console.log('[db] using JSON file store at', DATA_FILE);
}

function readJson() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeJson(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

export const fileStore = {
  all() {
    return readJson().feedbacks;
  },
  insert(doc) {
    const data = readJson();
    data.feedbacks.push(doc);
    writeJson(data);
    return doc;
  },
  replace(all) {
    writeJson({ feedbacks: all });
  },
  clear() {
    writeJson({ feedbacks: [] });
  },
};
