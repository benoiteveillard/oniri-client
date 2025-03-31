/**
 * Utility for detecting the current page in Webflow
 */

/**
 * Gets the current page name from URL or Webflow data
 * @returns {string} The current page name (e.g., 'home', 'contact', etc.)
 */
export function getCurrentPage() {
  // First try to get page info from Webflow's data
  if (window.Webflow && window.Webflow.env && window.Webflow.env.slug) {
    return window.Webflow.env.slug;
  }

  // Fallback to URL-based detection
  const path = window.location.pathname;

  // Remove leading and trailing slashes and get the first segment
  const cleanPath = path.replace(/^\/|\/$/g, '');

  // If it's the homepage (empty path)
  if (!cleanPath) {
    return 'home';
  }

  // Get the first segment of the path
  const firstSegment = cleanPath.split('/')[0];
  return firstSegment;
}

/**
 * Gets all path segments from the current URL
 * @returns {string[]} Array of path segments
 */
export function getPathSegments() {
  const path = window.location.pathname;
  const cleanPath = path.replace(/^\/|\/$/g, '');

  if (!cleanPath) {
    return [];
  }

  return cleanPath.split('/');
}

/**
 * Checks if the current page matches the given page name
 * @param {string} pageName - The page name to check against
 * @returns {boolean} True if current page matches
 */
export function isPage(pageName) {
  return getCurrentPage() === pageName;
}

/**
 * Checks if the current URL path matches a pattern
 * @param {string|RegExp} pattern - Pattern to match against the path
 * @returns {boolean} True if the path matches the pattern
 * @example
 * // Check if on a blog post page
 * if (matchesPattern('blog/*')) {
 *   // Code for blog post pages
 * }
 */
export function matchesPattern(pattern) {
  const path = window.location.pathname;

  if (pattern instanceof RegExp) {
    return pattern.test(path);
  }

  // Convert simple wildcard patterns to regex
  if (typeof pattern === 'string' && pattern.includes('*')) {
    const regexPattern = pattern
      .replace(/\//g, '\\/') // Escape slashes
      .replace(/\*/g, '([^/]+)'); // Replace * with capture group that matches anything except /

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  // Exact match
  return path === pattern || path === `/${pattern}` || path === `/${pattern}/`;
}

/**
 * Gets URL parameters from dynamic segments
 * @param {string} pattern - Pattern with placeholders (e.g., '/blog/:slug')
 * @returns {Object|null} Object with named parameters or null if pattern doesn't match
 * @example
 * // Get blog post slug
 * const params = getUrlParams('/blog/:slug');
 * if (params) {
 *   console.log(params.slug); // e.g., "my-blog-post"
 * }
 */
export function getUrlParams(pattern) {
  const path = window.location.pathname;

  // Convert pattern to regex with named capture groups
  const paramNames = [];
  const regexPattern = pattern
    .replace(/\//g, '\\/') // Escape slashes
    .replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)'; // Capture group that matches anything except /
    });

  const regex = new RegExp(`^${regexPattern}$`);
  const match = path.match(regex);

  if (!match) {
    return null;
  }

  // Create object with named parameters
  const params = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
}

/**
 * Executes a callback only if on the specified page
 * @param {string|string[]} pageNames - Page name(s) to match
 * @param {Function} callback - Function to execute if on matching page
 */
export function onPage(pageNames, callback) {
  const currentPage = getCurrentPage();
  const pages = Array.isArray(pageNames) ? pageNames : [pageNames];

  if (pages.includes(currentPage)) {
    callback();
  }
}

/**
 * Executes a callback only if the current URL matches a pattern
 * @param {string|RegExp|Array<string|RegExp>} patterns - Pattern(s) to match
 * @param {Function} callback - Function to execute if pattern matches
 * @example
 * // Execute code only on blog post pages
 * onPattern('blog/*', () => {
 *   // Code for blog posts
 * });
 *
 * // Or with a regex
 * onPattern(/^\/blog\/[^/]+$/, () => {
 *   // Code for blog posts
 * });
 *
 * // Or with named parameters
 * onPattern('/blog/:slug', (params) => {
 *   console.log(`Current blog post: ${params.slug}`);
 * });
 */
export function onPattern(patterns, callback) {
  const patternsArray = Array.isArray(patterns) ? patterns : [patterns];

  for (const pattern of patternsArray) {
    // Check if pattern uses named parameters (contains :)
    if (typeof pattern === 'string' && pattern.includes(':')) {
      const params = getUrlParams(pattern);
      if (params) {
        callback(params);
        return;
      }
    }
    // Regular pattern matching
    else if (matchesPattern(pattern)) {
      callback({});
      return;
    }
  }
}
