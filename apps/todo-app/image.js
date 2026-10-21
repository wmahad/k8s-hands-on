const fs = require("fs");

const imageFile = process.env.IMAGE_FILE || "image.jpg";
const imageMetaFile = process.env.IMAGE_META_FILE || "image-meta.json";
const ttlMs = Number(process.env.IMAGE_TTL_MS) || 10 * 60 * 1000;
const picsumUrl = process.env.PICSUM_URL || "https://picsum.photos/1200";

const readMeta = () => {
  try {
    return JSON.parse(fs.readFileSync(imageMetaFile, "utf8"));
  } catch {
    return null;
  }
};

const writeMeta = (meta) => {
  fs.writeFileSync(imageMetaFile, JSON.stringify(meta));
};

const fetchAndStore = async () => {
  const res = await fetch(picsumUrl);
  if (!res.ok) {
    throw new Error(`picsum ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "image/jpeg";
  fs.writeFileSync(imageFile, buffer);
  writeMeta({
    fetchedAt: Date.now(),
    contentType,
    servedStale: false,
  });
};

const prepareImage = async () => {
  const meta = readMeta();
  const exists = fs.existsSync(imageFile);

  if (!exists || !meta) {
    await fetchAndStore();
    return readMeta();
  }

  const expired = Date.now() - meta.fetchedAt >= ttlMs;
  if (!expired) {
    return meta;
  }

  if (!meta.servedStale) {
    writeMeta({ ...meta, servedStale: true });
    return { ...meta, servedStale: true };
  }

  await fetchAndStore();
  return readMeta();
};

const readImage = () => ({
  buffer: fs.readFileSync(imageFile),
  contentType: (readMeta() || {}).contentType || "image/jpeg",
});

module.exports = { prepareImage, readImage };
