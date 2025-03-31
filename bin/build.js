import * as esbuild from 'esbuild';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';

// Function to ensure a directory exists
const ensureDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// Ensure dist directory exists
ensureDir('dist');

// Function to find all entry points
const getEntryPoints = () => {
  const srcDir = 'src';
  
  if (!existsSync(srcDir)) {
    console.error(`❌ Source directory '${srcDir}' not found`);
    process.exit(1);
  }
  
  // Always include index.js as the main entry point
  const entryPoints = [join(srcDir, 'index.js')];
  
  // Add any CSS files in the root src directory
  const rootFiles = readdirSync(srcDir);
  rootFiles
    .filter(file => file.endsWith('.css'))
    .forEach(file => entryPoints.push(join(srcDir, file)));
  
  // Check if we have a styles directory
  const stylesDir = join(srcDir, 'styles');
  if (existsSync(stylesDir)) {
    // Add main.css if it exists
    const mainCssPath = join(stylesDir, 'main.css');
    if (existsSync(mainCssPath)) {
      entryPoints.push(mainCssPath);
    }
    
    // Add any page-specific CSS files
    const pageStylesDir = join(stylesDir, 'pages');
    if (existsSync(pageStylesDir)) {
      readdirSync(pageStylesDir)
        .filter(file => file.endsWith('.css'))
        .forEach(file => entryPoints.push(join(pageStylesDir, file)));
    }
  }

  console.log('\n📂 Entry points detected:', entryPoints);
  return entryPoints;
};

const PROD = process.env.NODE_ENV === 'production';

// Create a banner comment for production builds
const banner = PROD ? 
  `/* Webflow custom code - Built ${new Date().toISOString()} */\n` : '';

// Build configuration
const buildOptions = {
  entryPoints: getEntryPoints(),
  bundle: true,
  outdir: 'dist',
  minify: PROD,
  sourcemap: !PROD,
  target: 'es2020',
  format: 'esm',
  splitting: true, // Enable code splitting for better performance
  chunkNames: 'chunks/[name]-[hash]',
  inject: !PROD ? ['./bin/live-reload.js'] : undefined,
  banner: {
    js: banner,
    css: banner,
  },
  logLevel: 'info',
  loader: {
    '.js': 'jsx', // Support JSX syntax if needed
    '.css': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.gif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
  },
  outExtension: {
    '.css': '.css',
  },
  metafile: true, // Generate metadata for analyzing the build
};

const ctx = await esbuild.context(buildOptions);

if (PROD) {
  // Production build
  const result = await ctx.rebuild();
  ctx.dispose();
  
  // Log build results
  console.log('\n✅ Production build completed successfully!');
  
  // Analyze the build if metadata is available
  if (result.metafile) {
    const outputs = Object.keys(result.metafile.outputs);
    const totalSize = outputs.reduce((sum, file) => {
      const size = result.metafile.outputs[file].bytes;
      return sum + size;
    }, 0);
    
    console.log(`📊 Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // List the generated files
    console.log('\n📄 Generated files:');
    outputs.forEach(file => {
      const size = result.metafile.outputs[file].bytes;
      console.log(`   - ${file} (${(size / 1024).toFixed(2)} KB)`);
    });
  }
} else {
  // Development mode with watch and serve
  await ctx.watch();
  const { host, port } = await ctx.serve({ 
    servedir: 'dist', 
    port: 3000 
  });
  console.log(`\n🚀 Server running at http://localhost:${port}`);
  console.log('👀 Hot reload enabled\n');
  console.log('📝 Edit your files in the src directory and see changes instantly in the browser');
}