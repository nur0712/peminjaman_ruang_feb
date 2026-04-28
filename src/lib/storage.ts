import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function saveRequestLetter(file: File) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "request-letters");
  const extension = path.extname(file.name) || ".bin";
  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });

  const targetName = sanitizeName(fileName);
  const absolutePath = path.join(uploadDir, targetName);

  await writeFile(absolutePath, buffer);

  return {
    fileName: file.name,
    publicPath: `/uploads/request-letters/${targetName}`,
  };
}
