/**
 * Blog listing page specific functionality
 */
import { loadPageCSS } from '../../utils/css-loader.js';

/**
 * Initialize the blog listing page
 */
export function initBlogListingPage() {
  console.log('Blog listing page initialized');

  // Load the page-specific CSS
  loadPageCSS('blog-hub');
}
