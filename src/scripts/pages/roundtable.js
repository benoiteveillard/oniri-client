/**
 * Blog listing page specific functionality
 */
/**
 * Initialize the blog listing page
 */

export function initR() {
  // console.log('DOM loaded, initializing selector functionality');

  // Get all selector items and the list
  const allSelectorItems = document.querySelectorAll('[selector-item]');
  const selectorList = document.querySelector('.logo_selector-list');

  // Get the logo list container and individual logo lists
  const logoListContainer = document.querySelector('.persona_logo-list');
  const logoLists = document.querySelectorAll('.logo_list-wrapper');
  // console.log('Logo list container found:', logoListContainer ? 'Yes' : 'No');
  // console.log(`Found ${logoLists.length} logo lists`);

  // Define the item height
  const ITEM_HEIGHT = 50;

  // Get only visible selector items
  const getVisibleSelectorItems = () => {
    return Array.from(allSelectorItems).filter((item) => {
      const style = window.getComputedStyle(item);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
  };

  // Get visible personas
  const getVisiblePersonas = () => {
    const visiblePersonas = [];
    logoLists.forEach((list) => {
      const persona = list.getAttribute('selector-logo');
      const style = window.getComputedStyle(list);
      if (style.display !== 'none' && !list.classList.contains('hide')) {
        visiblePersonas.push(persona);
      }
    });
    return visiblePersonas;
  };

  // Function to check if a persona is visible in the DOM
  const isPersonaVisible = (persona) => {
    const list = document.querySelector(`[selector-logo="${persona}"]`);
    if (!list) return false;

    const style = window.getComputedStyle(list);
    return style.display !== 'none' && !list.classList.contains('hide');
  };

  // Set initial active item - try investment-clubs-3 first, fall back to investment-clubs-2 if needed
  let initialActiveSelector = document.querySelector('[selector-item="investment-clubs-3"]');

  // If not found, try investment-clubs-2 as fallback
  if (!initialActiveSelector) {
    initialActiveSelector = document.querySelector('[selector-item="investment-clubs-2"]');
  }

  if (initialActiveSelector) {
    // console.log('Setting initial active element:', initialActiveSelector.getAttribute('selector-item'));
    initialActiveSelector.classList.add('is-active');

    // Set initial active logo (investment-clubs)
    setActiveLogo('investment-clubs');
  } else {
    console.error('Could not find investment-clubs selector');
  }

  // Function to extract persona from selector attribute
  function extractPersona(selectorAttr) {
    // Check if it's a compound name (e.g., "investment-clubs-2" or "fund-managers-1")
    if (selectorAttr.indexOf('investment-clubs') === 0) {
      return 'investment-clubs';
    } else if (selectorAttr.indexOf('fund-managers') === 0) {
      return 'fund-managers';
    } else if (selectorAttr.indexOf('founders') === 0) {
      return 'founders';
    }

    console.error('Unknown persona in selector:', selectorAttr);
    return null;
  }

  // Function to set the active logo based on persona
  function setActiveLogo(persona) {
    // console.log('Setting active logo for persona:', persona);

    if (!persona) {
      console.error('No persona provided to setActiveLogo');
      return;
    }

    // Update data attribute for debugging
    if (logoListContainer) {
      logoListContainer.setAttribute('data-current-persona', persona);
    }

    // Get visible personas
    const visiblePersonas = getVisiblePersonas();

    // If the requested persona is not visible, use the first visible one instead
    if (!visiblePersonas.includes(persona)) {
      if (visiblePersonas.length > 0) {
        persona = visiblePersonas[0];
        console.log('Requested persona not visible, using:', persona);
      } else {
        console.error('No visible personas found');
        return;
      }
    }

    // Show the active logo list and hide others
    logoLists.forEach((list) => {
      const listPersona = list.getAttribute('selector-logo');

      // Skip if the list doesn't exist
      if (!listPersona) return;

      // Check if this persona is visible in the DOM
      const isVisible = visiblePersonas.includes(listPersona);

      // Skip hidden lists
      if (!isVisible) {
        return;
      }

      if (listPersona === persona) {
        // Show this list with animation
        list.classList.add('is-active-list');
        list.style.opacity = '1';
        list.style.visibility = 'visible';
        list.style.position = 'relative';
        list.style.zIndex = '2';
        list.style.transform = 'translateY(0)';

        // Ensure all logos in this list are visible
        const logoItems = list.querySelectorAll('.logo_item');
        logoItems.forEach((item) => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });

        // console.log(`Showing logo list for ${listPersona}`);
      } else {
        // Hide other lists
        list.classList.remove('is-active-list');
        list.style.opacity = '0';
        list.style.visibility = 'hidden';
        list.style.position = 'absolute';
        list.style.zIndex = '1';
        list.style.transform = 'translateY(20px)';

        // console.log(`Hiding logo list for ${listPersona}`);
      }
    });
  }

  // Function to handle selector click events
  function handleSelectorClick(selector) {
    const selectorAttr = selector.getAttribute('selector-item');
    // console.log('Selector clicked:', selectorAttr);

    // Find the currently active selector
    const currentActive = document.querySelector('[selector-item].is-active');
    if (!currentActive) {
      console.error('No active selector found');
      return;
    }

    // Get the selector-item attribute values
    const currentAttr = currentActive.getAttribute('selector-item');
    // console.log('Current active:', currentAttr, 'Clicked:', selectorAttr);

    // If the clicked element is already active, do nothing
    if (currentActive === selector) {
      // console.log('Clicked element is already active, doing nothing');
      return;
    }

    // Get only visible selector items for calculations
    const visibleSelectors = getVisibleSelectorItems();

    // Get the indices of the current and clicked elements within visible selectors
    const currentIndex = visibleSelectors.indexOf(currentActive);
    const clickedIndex = visibleSelectors.indexOf(selector);

    // If either element is not visible, don't proceed
    if (currentIndex === -1 || clickedIndex === -1) {
      console.error('Current or clicked selector is not visible');
      return;
    }

    // console.log('Current index:', currentIndex, 'Clicked index:', clickedIndex);

    // Calculate how many positions to move (positive for down, negative for up)
    const positionsToMove = clickedIndex - currentIndex;
    // console.log('Positions to move:', positionsToMove);

    // Get the current transform
    let currentTranslateY = 0;
    const currentTransform = window.getComputedStyle(selectorList).transform;
    if (currentTransform && currentTransform !== 'none') {
      const matrix = new DOMMatrixReadOnly(currentTransform);
      currentTranslateY = matrix.m42; // Get the Y translation value
      // console.log('Current translateY:', currentTranslateY);
    }

    // Calculate the new transform
    const newTranslateY = currentTranslateY - positionsToMove * ITEM_HEIGHT;
    // console.log('New translateY:', newTranslateY);

    // Update active class
    allSelectorItems.forEach((item) => {
      item.classList.remove('is-active');
    });
    selector.classList.add('is-active');

    // console.log('Updated active element to:', selectorAttr);

    // Apply the transform with a transition for smooth animation
    selectorList.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    selectorList.style.transform = `translateY(${newTranslateY}px)`;

    // Extract the persona from the selector-item attribute and update the logo
    const persona = extractPersona(selectorAttr);
    // console.log('Extracted persona:', persona);

    if (persona) {
      // Check if the persona is visible before trying to set it active
      if (isPersonaVisible(persona)) {
        setActiveLogo(persona);
      } else {
        // If not visible, find a visible persona to show instead
        const visiblePersonas = getVisiblePersonas();
        if (visiblePersonas.length > 0) {
          setActiveLogo(visiblePersonas[0]);
        }
      }
    }
  }

  // Add click event listeners to all selector items
  // console.log(`Found ${allSelectorItems.length} selector items, adding click listeners to all`);

  allSelectorItems.forEach((selectorItem) => {
    const selectorName = selectorItem.getAttribute('selector-item');
    // console.log(`Adding click listener to ${selectorName}`);

    selectorItem.addEventListener('click', function () {
      handleSelectorClick(selectorItem);
    });
  });

  // Add CSS for the logo lists and animations
  addLogoStyles();

  // Function to add custom styles for the logo lists
  function addLogoStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
                .logo_list-wrapper {
                    transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    visibility: hidden;
                    transform: translateY(20px);
                }
                
                .logo_list-wrapper.is-active-list {
                    opacity: 1;
                    visibility: visible;
                    position: relative;
                    transform: translateY(0);
                }
                
                .logo_item {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                
                .is-active-list .logo_item:hover {
                    transform: scale(1.05);
                }
                
                /* Remove any existing transform on the parent container */
                .persona_logo-list {
                    transform: none !important;
                    transition: none !important;
                    position: relative;
                }
                
                /* Hide fund-managers items if they have the hide class */
                .hide {
                    display: none !important;
                }
            `;
    document.head.appendChild(styleElement);

    // Initialize by showing only the active logo list
    setActiveLogo('investment-clubs');
  }

  // console.log('Initialization complete');
}
