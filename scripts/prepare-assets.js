// @ts-check
import assert from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";

import sharp from "sharp";

// Copy over output.json
await fs.promises.copyFile(
	path.resolve(import.meta.dirname, "../data/output.json"),
	path.resolve(import.meta.dirname, "../src/output.json"),
);

// Compress images from PNG -> WebP
// organized as: inputDir/<dir>/<name>.png
let inputDir = path.resolve(import.meta.dirname, "../data/images/");
let outputDir = path.resolve(import.meta.dirname, "../static/images/");
for (let dir of await fs.promises.readdir(inputDir, {
	withFileTypes: true,
})) {
	assert(dir.isDirectory());
	if (!fs.existsSync(path.resolve(outputDir, dir.name))) {
		fs.mkdirSync(path.resolve(outputDir, dir.name), { recursive: true });
	}
	for (let file of await fs.promises.readdir(
		path.resolve(dir.parentPath, dir.name),
		{ withFileTypes: true },
	)) {
		assert(file.isFile() && file.name.endsWith(".png"), "Missing png.");
		let source = path.resolve(dir.parentPath, dir.name, file.name);
		let target = path.resolve(
			outputDir,
			dir.name,
			file.name.replace(/\.png$/i, ".webp"),
		);
		sharp(source)
			.webp({ quality: 80, lossless: false })
			.toFile(target)
			.then(() => console.log(`Created ${target}`))
			.catch((err) => console.error(`Error converting ${source}:`, err));
	}
}
