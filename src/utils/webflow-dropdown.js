/**
 * Webflow Dropdown Utilities
 * Helper functions for working with Webflow dropdown elements
 */

/**
 * Closes a Webflow dropdown by simulating a click outside the dropdown
 * @param {Element|string} dropdown - The dropdown element or selector
 * @returns {boolean} - True if dropdown was found and close was attempted
 */
function closeDropdown(dropdown) {
  // Handle selector strings
  if (typeof dropdown === 'string') {
    dropdown = document.querySelector(dropdown);
  }

  // Check if dropdown exists
  if (!dropdown) {
    console.warn('Dropdown element not found');
    return false;
  }

  // Create and dispatch a click event outside the dropdown
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  // Dispatch the event on the document body to simulate clicking outside
  document.body.dispatchEvent(clickEvent);

  return true;
}

/**
 * Closes all open Webflow dropdowns on the page
 * @returns {number} - Number of dropdowns that were closed
 */
function closeAllDropdowns() {
  // Find all open dropdowns (they have the 'w--open' class)
  const openDropdowns = document.querySelectorAll('.w-dropdown-list.w--open');

  if (openDropdowns.length === 0) {
    return 0;
  }

  // Simulate a click outside to close all dropdowns
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  document.body.dispatchEvent(clickEvent);

  return openDropdowns.length;
}

/**
 * Adds a click handler to close dropdowns when clicking outside
 * @param {string} excludeSelector - Optional selector for elements that shouldn't trigger closing
 * @returns {Function} - Function to remove the event listener
 */
function setupAutoCloseDropdowns(excludeSelector = null) {
  const handleClick = (event) => {
    // Don't close if clicking on excluded elements
    if (excludeSelector && event.target.closest(excludeSelector)) {
      return;
    }

    // Don't close if clicking on dropdown toggle or within dropdown
    if (event.target.closest('.w-dropdown-toggle, .w-dropdown-list')) {
      return;
    }

    closeAllDropdowns();
  };

  document.addEventListener('click', handleClick);

  // Return function to remove the listener if needed
  return () => document.removeEventListener('click', handleClick);
}

// Export all functions
export { closeDropdown, closeAllDropdowns, setupAutoCloseDropdowns };

// HOW TO USE ON A FILE

/**
import { closeDropdown, closeAllDropdowns } from './utils/webflow-dropdown.js';

// Close a specific dropdown
const myDropdown = document.querySelector('#my-dropdown');
closeDropdown(myDropdown);

// Or close by selector
closeDropdown('#my-dropdown');

// Close all dropdowns on the page
closeAllDropdowns();

// Set up auto-closing when clicking outside
const removeListener = setupAutoCloseDropdowns();

// Later, if you need to remove the auto-close behavior
removeListener();

 */
