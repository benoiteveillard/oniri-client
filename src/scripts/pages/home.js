/**
 * Home page specific JavaScript
 */

import { getCurrentBreakpoint } from '../../utils/webflow-breakpoints.js';
import { setupAutoCloseDropdowns } from '../../utils/webflow-dropdown.js';
import { loadPageCSS } from '../../utils/css-loader.js';

// Initialize home page functionality
export function initHomePage() {
  console.log('Home page initialized');

  // Load the page-specific CSS
  loadPageCSS('home');

  // Example: Responsive adjustments based on breakpoint
  const currentBreakpoint = getCurrentBreakpoint();
  if (currentBreakpoint === 'mobile landscape' || currentBreakpoint === 'mobile portrait') {
    // Mobile-specific adjustments
    console.log('Mobile layout active on home page');
  }
}
