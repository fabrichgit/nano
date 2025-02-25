import fs from 'fs';
import path from 'path';
import { Extract } from 'unzipper';

export async function extractZip(zipPath: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(Extract({ path: destPath }))
      .on('close', () => {
        handleExtractedFiles(destPath).then(resolve).catch(reject);
      })
      .on('error', reject);
  });
}

async function handleExtractedFiles(dirPath: string): Promise<void> {
  const files = await fs.promises.readdir(dirPath);
  
  // Check if there's only one item and it's a directory
  if (files.length === 1) {
    const itemPath = path.join(dirPath, files[0]);
    const stats = await fs.promises.stat(itemPath);
    
    if (stats.isDirectory()) {
      // Create a temporary directory for moving files
      const tempDir = path.join(dirPath, '_temp');
      await fs.promises.mkdir(tempDir);
      
      // Move all files from the subdirectory to temp directory
      const subFiles = await fs.promises.readdir(itemPath);
      for (const file of subFiles) {
        const sourcePath = path.join(itemPath, file);
        const tempPath = path.join(tempDir, file);
        await fs.promises.rename(sourcePath, tempPath);
      }
      
      // Remove the original subdirectory
      await fs.promises.rmdir(itemPath);
      
      // Move files from temp to destination
      const tempFiles = await fs.promises.readdir(tempDir);
      for (const file of tempFiles) {
        const sourcePath = path.join(tempDir, file);
        const destFilePath = path.join(dirPath, file);
        await fs.promises.rename(sourcePath, destFilePath);
      }
      
      // Remove temp directory
      await fs.promises.rmdir(tempDir);
    }
  }
}