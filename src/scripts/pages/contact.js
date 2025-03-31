/**
 * Contact page specific JavaScript
 */

import { loadPageCSS } from '../../utils/css-loader.js';
import '@justaa/scripts/dist/forms/deactivate-option-select.js';

// Initialize contact page functionality
export function initContactPage() {
  console.log('Contact page initialized');

  // Load the page-specific CSS
  loadPageCSS('contact');
}
