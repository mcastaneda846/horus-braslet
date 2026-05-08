import { readFileSync } from "fs";
import { resolve, basename } from "path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Uso: node scripts/ingest.mjs <ruta-al-archivo.md>");
  console.error("Ejemplo: node scripts/ingest.mjs docs/primeros-auxilios.md");
  process.exit(1);
}

if (!filePath.endsWith(".md")) {
  console.error("Solo se aceptan archivos .md");
  process.exit(1);
}

const fullPath    = resolve(filePath);
const fileContent = readFileSync(fullPath, "utf-8");
const fileName    = basename(fullPath);

console.log(`Archivo:    ${fileName}`);
console.log(`Tamaño:     ${(fileContent.length / 1024).toFixed(1)} KB`);
console.log(`Indexando en Pinecone...`);

let response;
try {
  response = await fetch("http://localhost:3000/api/ai/ingest", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ fileName, fileContent }),
  });
} catch {
  console.error("No se pudo conectar al servidor. ¿Está corriendo 'npm run dev'?");
  process.exit(1);
}

const data = await response.json();

if (!response.ok) {
  console.error("Error del servidor:", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(`Listo`);
console.log(`   Chunks indexados: ${data.chunksIndexed}`);
console.log(`   Archivo:          ${data.fileName}`);
