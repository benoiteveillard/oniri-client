/**
 * Utility for dynamically loading CSS files
 */

/**
 * Dynamically loads a CSS file
 * @param {string} path - Path to the CSS file
 * @returns {Promise} A promise that resolves when the CSS is loaded
 */
export function loadCSS(path) {
  return new Promise((resolve, reject) => {
    // Check if the stylesheet is already loaded
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    for (const link of existingLinks) {
      if (link.getAttribute('href') === path) {
        resolve(); // Already loaded
        return;
      }
    }

    // Create a new link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;

    // Set up load handlers
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load CSS: ${path}`));

    // Add to document head
    document.head.appendChild(link);
  });
}

/**
 * Loads a page-specific CSS file
 * @param {string} pageName - The name of the page (e.g., 'blog-hub', 'blog-template')
 * @returns {Promise} A promise that resolves when the CSS is loaded
 */
export function loadPageCSS(pageName) {
  // In development, we use the local server path
  // Check if we're in development mode by looking at the URL
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port !== '';

  if (isDevelopment) {
    return loadCSS(`/pages/${pageName}.css`);
  }

  // In production, we use the deployed path
  // Adjust this URL to match your Cloudflare Pages URL structure
  const baseUrl = window.location.origin;
  return loadCSS(`${baseUrl}/pages/${pageName}.css`);
}
