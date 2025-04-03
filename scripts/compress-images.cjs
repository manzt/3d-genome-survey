// @ts-check
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

function processDirectory(dirPath, relativePath = "") {
	let items = fs.readdirSync(dirPath);

	for (const item of items) {
		let itemPath = path.join(dirPath, item);
		let itemRelativePath = path.join(relativePath, item);
		let stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			let destSubDir = path.join(outputDir, itemRelativePath);
			if (!fs.existsSync(destSubDir)) {
				fs.mkdirSync(destSubDir, { recursive: true });
			}
			processDirectory(itemPath, itemRelativePath);
		} else if (stats.isFile() && item.toLowerCase().endsWith(".png")) {
			let destSubDir = path.join(outputDir, relativePath);

			if (!fs.existsSync(destSubDir)) {
				fs.mkdirSync(destSubDir, { recursive: true });
			}

			let outputFilename = item.replace(/\.png$/i, ".webp");
			let outputPath = path.join(destSubDir, outputFilename);

			sharp(itemPath)
				.webp({ quality: 80, lossless: false })
				.toFile(outputPath)
				.then(() => {
					let inputSize = fs.statSync(itemPath).size;
					let outputSize = fs.statSync(outputPath).size;
					let savings = ((1 - outputSize / inputSize) * 100).toFixed(2);
					console.log(
						`Converted ${itemRelativePath} to WebP, saved ${savings}% (${(inputSize - outputSize) / 1024} KB)`,
					);
				})
				.catch((err) => {
					console.error(`Error converting ${itemRelativePath}:`, err);
				});
		}
	}
}

let inputDir = path.resolve(__dirname, "../data/images/");
let outputDir = path.resolve(__dirname, "../static/images/");

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

console.log(
	`Starting PNG to WebP conversion from ${inputDir} to ${outputDir}...`,
);
processDirectory(inputDir);
console.log("Conversion process initiated. Check console for progress...");
