/**
 * Main entry point for Webflow custom code
 * This file loads the appropriate page-specific code based on the current URL
 */

// Import utility functions
import { getCurrentPage, onPage, onPattern } from './utils/page-routing.js';
import { initGlobalFunctionality } from './scripts/main.js';

// Initialize Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('Webflow initialized');

  // Setup global functionality that should run on all pages
  initGlobalFunctionality();

  // Load page-specific code
  loadPageSpecificCode();
});

/**
 * Loads code specific to the current page
 */
async function loadPageSpecificCode() {
  const currentPage = getCurrentPage();
  console.log(`Current page: ${currentPage}`);

  try {
    // Static pages - using onPage
    // -------------------------------------------------------------------------

    // Home page
    onPage('home', async () => {
      const { initHomePage } = await import('./scripts/pages/home.js');
      initHomePage();
    });

    // Contact page
    onPage('contact', async () => {
      const { initContactPage } = await import('./scripts/pages/contact.js');
      initContactPage();
    });

    // Dynamic pages - using onPattern
    // -------------------------------------------------------------------------

    // Blog listing page
    onPage('blog', async () => {
      const { initBlogListingPage } = await import('./scripts/pages/blog-hub.js');
      initBlogListingPage();
    });

    // Blog post pages - using wildcard pattern matching
    onPattern('blog/*', async () => {
      console.log('Blog post page detected');
      const { initBlogPostPage } = await import('./scripts/pages/blog-template.js');
      initBlogPostPage();
    });
  } catch (error) {
    console.error('Error loading page-specific code:', error);
  }
}
