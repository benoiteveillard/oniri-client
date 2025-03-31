/**
 * Webflow Breakpoints Utility
 * Simple utility for working with Webflow's default responsive breakpoints
 */

/**
 * The default Webflow breakpoint names
 * - desktop: Default/desktop view
 * - tablet: Tablet landscape
 * - mobile landscape: Tablet portrait
 * - mobile portrait: Mobile
 */

/**
 * Defines the default media queries for Webflow's breakpoints
 */
const WEBFLOW_BREAKPOINTS = new Map([
  ['desktop', '(min-width: 992px)'],
  ['tablet', '(min-width: 768px) and (max-width: 991px)'],
  ['mobile landscape', '(min-width: 480px) and (max-width: 767px)'],
  ['mobile portrait', '(max-width: 479px)'],
]);

/**
 * Checks the current breakpoint based on the window media
 * @returns {string} The current breakpoint name ('desktop', 'tablet', 'mobile landscape', or 'mobile portrait')
 */
function getCurrentBreakpoint() {
  for (const [breakpoint, mediaQuery] of WEBFLOW_BREAKPOINTS) {
    if (window.matchMedia(mediaQuery).matches) {
      return breakpoint;
    }
  }
  return 'main'; // Default fallback
}

/**
 * Checks if the current breakpoint is mobile (tiny or small)
 * @returns {boolean} True if current breakpoint is mobile
 */
function isMobileBreakpoint() {
  const current = getCurrentBreakpoint();
  return current === 'mobile landscape' || current === 'mobile portrait';
}

/**
 * Runs a callback when the breakpoint changes
 * @param {Function} callback - Function to run when breakpoint changes
 * @returns {Function} Function to remove the event listener
 */
function onBreakpointChange(callback) {
  let currentBreakpoint = getCurrentBreakpoint();

  const handleResize = () => {
    const newBreakpoint = getCurrentBreakpoint();
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      callback(currentBreakpoint);
    }
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}

// Export all functions and constants
export { WEBFLOW_BREAKPOINTS, getCurrentBreakpoint, isMobileBreakpoint, onBreakpointChange };

// HOW TO USE
/**
 * Basic usage examples:
 *
 * 1. Check current breakpoint:
 *
 * import { getCurrentBreakpoint } from './utils/webflow-breakpoints.js';
 *
 * window.Webflow ||= [];
 * window.Webflow.push(() => {
 *   // Simple conditional based on breakpoint
 *   const currentBreakpoint = getCurrentBreakpoint();
 *
 *   if (currentBreakpoint === 'desktop') {
 *     // Desktop layout adjustments
 *     console.log('Desktop layout active');
 *   } else {
 *     // Mobile/tablet layout adjustments
 *     console.log('Mobile or tablet layout active');
 *   }
 * });
 *
 * 2. React to breakpoint changes:
 *
 * import { onBreakpointChange } from './utils/webflow-breakpoints.js';
 *
 * window.Webflow ||= [];
 * window.Webflow.push(() => {
 *   // Set up listener for breakpoint changes
 *   const removeListener = onBreakpointChange((newBreakpoint) => {
 *     console.log(`Breakpoint changed to: ${newBreakpoint}`);
 *
 *     // Update layout based on new breakpoint
 *     if (newBreakpoint === 'mobile portrait' || newBreakpoint === 'mobile landscape') {
 *       // Apply mobile layout
 *     } else {
 *       // Apply desktop layout
 *     }
 *   });
 *
 *   // To remove the listener when no longer needed:
 *   // removeListener();
 * });
 */
