"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractZip = extractZip;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unzipper_1 = require("unzipper");
async function extractZip(zipPath, destPath) {
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(zipPath)
            .pipe((0, unzipper_1.Extract)({ path: destPath }))
            .on('close', () => {
            handleExtractedFiles(destPath).then(resolve).catch(reject);
        })
            .on('error', reject);
    });
}
async function handleExtractedFiles(dirPath) {
    const files = await fs_1.default.promises.readdir(dirPath);
    // Check if there's only one item and it's a directory
    if (files.length === 1) {
        const itemPath = path_1.default.join(dirPath, files[0]);
        const stats = await fs_1.default.promises.stat(itemPath);
        if (stats.isDirectory()) {
            // Create a temporary directory for moving files
            const tempDir = path_1.default.join(dirPath, '_temp');
            await fs_1.default.promises.mkdir(tempDir);
            // Move all files from the subdirectory to temp directory
            const subFiles = await fs_1.default.promises.readdir(itemPath);
            for (const file of subFiles) {
                const sourcePath = path_1.default.join(itemPath, file);
                const tempPath = path_1.default.join(tempDir, file);
                await fs_1.default.promises.rename(sourcePath, tempPath);
            }
            // Remove the original subdirectory
            await fs_1.default.promises.rmdir(itemPath);
            // Move files from temp to destination
            const tempFiles = await fs_1.default.promises.readdir(tempDir);
            for (const file of tempFiles) {
                const sourcePath = path_1.default.join(tempDir, file);
                const destFilePath = path_1.default.join(dirPath, file);
                await fs_1.default.promises.rename(sourcePath, destFilePath);
            }
            // Remove temp directory
            await fs_1.default.promises.rmdir(tempDir);
        }
    }
}
