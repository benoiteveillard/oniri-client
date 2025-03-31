/**
 * Restarts the Webflow JS library.
 *
 * @param {Array} modules - An array of Webflow modules to restart. If passed, only those modules will be restarted instead of the whole Webflow instance.
 * @returns {Promise} - A promise that resolves when the library has been correctly reinitialized.
 */
export const restartWebflow = async (modules) => {
  const { Webflow } = window;
  if (!Webflow || !('destroy' in Webflow) || !('ready' in Webflow) || !('require' in Webflow))
    return;
  if (modules && !modules.length) return;

  // Global
  if (!modules) {
    Webflow.destroy();
    Webflow.ready();
  }

  // IX2
  if (!modules || modules.includes('ix2')) {
    const ix2 = Webflow.require('ix2');
    if (ix2) {
      const { store, actions } = ix2;
      const { eventState } = store.getState().ixSession;
      const stateEntries = Object.entries(eventState);
      if (!modules) ix2.destroy();
      ix2.init();
      await Promise.all(
        stateEntries.map((state) => store.dispatch(actions.eventStateChanged(...state)))
      );
    }
  }

  // Lightbox
  if (modules && modules.includes('lightbox')) {
    const lightbox = Webflow.require('lightbox');
    if (lightbox && lightbox.ready) {
      lightbox.ready();
    }
  }

  // Slider
  if (modules && modules.includes('slider')) {
    const slider = Webflow.require('slider');
    if (slider) {
      slider.redraw();
      slider.ready();
    }
  }

  // Tabs
  if (modules && modules.includes('tabs')) {
    const tabs = Webflow.require('tabs');
    if (tabs && tabs.redraw) {
      tabs.redraw();
    }
  }

  return new Promise((resolve) => Webflow.push(() => resolve(undefined)));
};

/**
 * HOW TO USE:
 *
 * import { restartWebflow } from './utils/webflow-restart.js';
 *
 * // Restart the entire Webflow instance
 * restartWebflow();
 *
 * // Or restart only specific modules
 * restartWebflow(['slider', 'tabs']);
 */
