/**
 * Main JavaScript file that runs on all pages
 */

/**
 * Initialize global functionality that should run on all pages
 */
export function initGlobalFunctionality() {
  console.log('Global functionality initialized');

  // Example: Set up global event listeners
  setupGlobalEventListeners();

  // Example: Initialize third-party libraries
  initializeThirdPartyLibraries();
}

/**
 * Set up event listeners that should be available on all pages
 */
function setupGlobalEventListeners() {
  // Example: Handle responsive layout based on breakpoint
  window.addEventListener('resize', handleBreakpointLayout);

  // Run once on page load
  handleBreakpointLayout();
}

/**
 * Handle responsive layout adjustments based on current breakpoint
 */
function handleBreakpointLayout() {
  // You could import a breakpoint utility here if needed
  const width = window.innerWidth;

  if (width >= 992) {
    // Desktop layout adjustments
    console.log('Desktop layout active');
  } else if (width >= 768) {
    // Tablet layout adjustments
    console.log('Tablet layout active');
  } else {
    // Mobile layout adjustments
    console.log('Mobile layout active');
  }
}

/**
 * Initialize any third-party libraries that should be available globally
 */
function initializeThirdPartyLibraries() {
  // Example: Initialize analytics
  if (window.analytics) {
    console.log('Analytics initialized');
  }
}
