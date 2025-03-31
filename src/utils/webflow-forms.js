/**
 * Webflow Form Utility
 * Handles form validation and custom submission logic for Webflow forms
 */

import { FORM_CSS_CLASSES } from './webflow-css.js';

/**
 * Shows an error message for a form field
 * @param {HTMLElement} field - The form field
 * @param {string} message - Error message to display
 */
function showError(field, message) {
  // Find the closest parent form block
  const formBlock = field.closest(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Find or create error element
  let errorEl = field.parentNode.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    field.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
  field.classList.add('has-error');
}

/**
 * Clears error messages
 * @param {HTMLFormElement} form - The form element
 */
function clearErrors(form) {
  form.querySelectorAll('.form-error').forEach((el) => el.remove());
  form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
}

/**
 * Shows Webflow's success message and hides the form
 * @param {HTMLFormElement} form - The form element
 */
function showSuccessMessage(form) {
  // Find the closest form block
  const formBlock = form.closest(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Hide the form
  form.style.display = 'none';

  // Show success message
  const successMessage = formBlock.querySelector(`.${FORM_CSS_CLASSES.successMessage}`);
  if (successMessage) {
    successMessage.style.display = 'block';
  }
}

/**
 * Shows Webflow's error message
 * @param {HTMLFormElement} form - The form element
 * @param {string} [customMessage] - Optional custom error message
 */
function showErrorMessage(form, customMessage) {
  // Find the closest form block
  const formBlock = form.closest(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Show error message
  const errorMessage = formBlock.querySelector(`.${FORM_CSS_CLASSES.errorMessage}`);
  if (errorMessage) {
    if (customMessage) {
      errorMessage.textContent = customMessage;
    }
    errorMessage.style.display = 'block';
  }
}

/**
 * Hides both success and error messages
 * @param {HTMLFormElement} form - The form element
 */
function hideMessages(form) {
  // Find the closest form block
  const formBlock = form.closest(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  // Hide messages
  const successMessage = formBlock.querySelector(`.${FORM_CSS_CLASSES.successMessage}`);
  const errorMessage = formBlock.querySelector(`.${FORM_CSS_CLASSES.errorMessage}`);

  if (successMessage) {
    successMessage.style.display = 'none';
  }

  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
}

/**
 * Sets up form validation and custom submission handling
 * @param {string|HTMLFormElement} formSelector - CSS selector or form element
 * @param {Object} options - Configuration options
 * @param {Object} options.validationRules - Rules for form validation
 * @param {Function} options.onSubmit - Custom submit handler
 * @param {boolean} options.preventDefault - Whether to prevent default form submission
 * @param {Function} options.onValidationSuccess - Called when validation succeeds
 * @param {Function} options.onValidationError - Called when validation fails
 * @returns {Function|null} Function to remove event listeners or null if form not found
 */
export function setupForm(formSelector, options = {}) {
  const form =
    typeof formSelector === 'string' ? document.querySelector(formSelector) : formSelector;

  if (!form) return null;

  const {
    validationRules = {},
    onSubmit = null,
    preventDefault = false,
    onValidationSuccess = null,
    onValidationError = null,
  } = options;

  const handleSubmit = (e) => {
    // Clear previous errors
    clearErrors(form);
    hideMessages(form);

    // Validate form if rules provided
    let isValid = true;

    if (Object.keys(validationRules).length > 0) {
      for (const [fieldSelector, rules] of Object.entries(validationRules)) {
        const field = form.querySelector(fieldSelector);
        if (!field) continue;

        for (const rule of rules) {
          if (!rule.validate(field.value, form)) {
            isValid = false;
            showError(field, rule.message);
            break;
          }
        }
      }
    }

    // Handle validation result
    if (!isValid) {
      e.preventDefault();
      if (onValidationError) onValidationError(form);
      return;
    }

    // Call validation success callback
    if (onValidationSuccess) onValidationSuccess(form);

    // Handle custom submission
    if (onSubmit) {
      if (preventDefault) e.preventDefault();
      onSubmit(e, form);
    }
  };

  form.addEventListener('submit', handleSubmit);

  // Return function to remove listeners
  return () => {
    form.removeEventListener('submit', handleSubmit);
  };
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    validate: (value) => value.trim() !== '',
    message,
  }),
  email: (message = 'Please enter a valid email address') => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  minLength: (length, message = `Must be at least ${length} characters`) => ({
    validate: (value) => value.length >= length,
    message,
  }),
  maxLength: (length, message = `Must be no more than ${length} characters`) => ({
    validate: (value) => value.length <= length,
    message,
  }),
  pattern: (regex, message = 'Invalid format') => ({
    validate: (value) => regex.test(value),
    message,
  }),
  match: (otherFieldSelector, message = 'Fields do not match') => ({
    validate: (value, form) => {
      const otherField = form.querySelector(otherFieldSelector);
      return otherField ? value === otherField.value : true;
    },
    message,
  }),
  number: (message = 'Please enter a valid number') => ({
    validate: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    message,
  }),
  min: (min, message = `Value must be at least ${min}`) => ({
    validate: (value) => parseFloat(value) >= min,
    message,
  }),
  max: (max, message = `Value must be no more than ${max}`) => ({
    validate: (value) => parseFloat(value) <= max,
    message,
  }),
};

/**
 * Helper functions for working with Webflow forms
 */
export const FormHelpers = {
  showSuccessMessage,
  showErrorMessage,
  hideMessages,
  clearErrors,
};

// HOW TO USE
/**
 * Basic form validation and submission example:
 *
 * import { setupForm, ValidationRules, FormHelpers } from './utils/webflow-forms.js';
 *
 * // Set up a contact form with validation and custom submission
 * setupForm('#contact-form', {
 *   validationRules: {
 *     '#email': [ValidationRules.required(), ValidationRules.email()],
 *     '#name': [ValidationRules.required(), ValidationRules.minLength(2)],
 *     '#message': [ValidationRules.required(), ValidationRules.minLength(10)]
 *   },
 *   preventDefault: true, // Prevent default form submission
 *   onSubmit: async (event, form) => {
 *     // Show loading state
 *     const submitButton = form.querySelector('input[type="submit"]');
 *     const originalText = submitButton.value;
 *     submitButton.value = 'Sending...';
 *     submitButton.disabled = true;
 *
 *     // Get form data
 *     const formData = new FormData(form);
 *     const data = Object.fromEntries(formData.entries());
 *
 *     try {
 *       // Send data to your API
 *       const response = await fetch('https://your-api.com/submit', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(data)
 *       });
 *
 *       if (response.ok) {
 *         // Show success message
 *         form.reset();
 *         FormHelpers.showSuccessMessage(form);
 *       } else {
 *         // Show error message
 *         FormHelpers.showErrorMessage(form, 'Failed to submit form. Please try again.');
 *       }
 *     } catch (error) {
 *       // Handle error
 *       FormHelpers.showErrorMessage(form);
 *     } finally {
 *       // Reset button
 *       submitButton.value = originalText;
 *       submitButton.disabled = false;
 *     }
 *   }
 * });
 */
