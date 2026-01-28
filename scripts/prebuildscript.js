const fs = require('fs');
const path = require('path');
const axios = require('axios');

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'products');
const LEGACY_FILE = path.join(__dirname, '..', 'src', 'products.json');
const MAX_CHUNK_BYTES = Number(process.env.PRODUCT_CHUNK_MAX_BYTES || 2 * 1024 * 1024);

const ensureCleanOutputDir = () => {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
};

const writeChunk = (items, index) => {
  if (!items.length) return null;
  const chunkName = `products_chunk_${String(index).padStart(3, '0')}.json`;
  const chunkPath = path.join(OUTPUT_DIR, chunkName);
  fs.writeFileSync(chunkPath, JSON.stringify(items));
  console.log(`Wrote ${items.length} products to ${chunkName}`);
  return chunkName;
};

const buildIndexFile = (chunkFiles) => {
  if (!chunkFiles.length) {
    return 'const products = [];\n\nexport default products;\n';
  }

  const imports = chunkFiles
    .map((file, idx) => `import chunk${idx} from "./${file}";`)
    .join('\n');
  const spreads = chunkFiles.map((_, idx) => `  ...chunk${idx},`).join('\n');

  return `${imports}\n\nconst products = [\n${spreads}\n];\n\nexport default products;\n`;
};

async function fetchProducts() {
  try {
    console.log('Fetching products...');
    const res = await axios.get('https://phplaravel-1533788-5916744.cloudwaysapps.com/api/get_products/?per_page=-1');
    // Try to locate the products array in the response
    let data = [];
    if (Array.isArray(res.data)) {
      data = res.data;
    } else if (Array.isArray(res.data?.data)) {
      data = res.data.data;
    } else if (Array.isArray(res.data?.data?.data)) {
      data = res.data.data.data;
    } else {
      const foundArray = Object.values(res.data).find((v) => Array.isArray(v));
      if (foundArray) data = foundArray;
    }

    ensureCleanOutputDir();
    if (fs.existsSync(LEGACY_FILE)) {
      fs.rmSync(LEGACY_FILE);
    }

    const chunkFiles = [];
    let chunk = [];
    let chunkIndex = 1;

    for (const product of data) {
      chunk.push(product);
      const serialized = JSON.stringify(chunk);
      const sizeBytes = Buffer.byteLength(serialized, 'utf8');

      if (sizeBytes > MAX_CHUNK_BYTES && chunk.length > 1) {
        const last = chunk.pop();
        const fileName = writeChunk(chunk, chunkIndex++);
        if (fileName) chunkFiles.push(fileName);
        chunk = [last];
      } else if (sizeBytes > MAX_CHUNK_BYTES) {
        console.warn(
          `Single product exceeds max chunk size (${MAX_CHUNK_BYTES} bytes). Consider increasing PRODUCT_CHUNK_MAX_BYTES.`
        );
      }
    }

    if (chunk.length) {
      const fileName = writeChunk(chunk, chunkIndex++);
      if (fileName) chunkFiles.push(fileName);
    }

    const indexPath = path.join(OUTPUT_DIR, 'index.js');
    fs.writeFileSync(indexPath, buildIndexFile(chunkFiles));
    console.log(
      `Wrote ${Array.isArray(data) ? data.length : 0} products across ${chunkFiles.length} chunk(s) to ${OUTPUT_DIR}`
    );
  } catch (err) {
    console.error('Failed to fetch products', err.message || err);
    process.exit(1);
  }
}

fetchProducts();
