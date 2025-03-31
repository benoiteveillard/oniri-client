/**
 * Script to copy page-specific CSS files to the dist/pages directory
 */
import { readdirSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

// Function to ensure a directory exists
const ensureDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// Copy page-specific CSS files
const copyPageCSS = () => {
  const pageStylesDir = join('src', 'styles', 'pages');
  const outputDir = join('dist', 'pages');
  
  if (!existsSync(pageStylesDir)) {
    console.log('No page-specific CSS directory found.');
    return;
  }
  
  // Ensure the output directory exists
  ensureDir(outputDir);
  
  // Process each page CSS file
  const pageStyles = readdirSync(pageStylesDir).filter(file => file.endsWith('.css'));
  
  if (pageStyles.length === 0) {
    console.log('No page-specific CSS files found.');
    return;
  }
  
  console.log('\n📄 Copying page-specific CSS files:');
  
  // Copy each page CSS file
  pageStyles.forEach(file => {
    const inputPath = join(pageStylesDir, file);
    const outputPath = join(outputDir, file);
    
    try {
      copyFileSync(inputPath, outputPath);
      console.log(`   - ${file} → ${outputPath}`);
    } catch (error) {
      console.error(`   ❌ Error copying ${file}:`, error);
    }
  });
  
  console.log('✅ Page CSS files copied successfully!');
};

// Run the copy operation
copyPageCSS();
