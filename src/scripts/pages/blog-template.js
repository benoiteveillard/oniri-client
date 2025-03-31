/**
 * Blog post page specific functionality
 */
import { loadPageCSS } from '../../utils/css-loader.js';

/**
 * Initialize the blog post page
 * @param {string} [slug] - The blog post slug from the URL
 */
export function initBlogPostPage(slug) {
  console.log('Blog post page initialized');

  // Load the page-specific CSS
  loadPageCSS('blog-template');

  if (slug) {
    console.log(`Blog post slug: ${slug}`);
  } else {
    // Extract slug from URL if not provided
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length >= 2 && pathSegments[0] === 'blog') {
      const postSlug = pathSegments[1];
      console.log(`Blog post slug: ${postSlug}`);
    }
  }
}
