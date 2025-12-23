import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes user input to prevent XSS attacks
 * Strips all HTML tags and attributes
 */
export const sanitizeText = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
};

/**
 * Sanitizes comment body - allows basic formatting
 */
export const sanitizeCommentBody = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    allowedAttributes: {}
  }).trim();
};
