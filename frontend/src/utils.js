/**
 * Converts a category name to a URL-friendly format.
 * Example: "Non Fiction" -> "non-fiction"
 * @param {string} category
 * @returns {string}
 */
export function formatCategoryForUrl(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Converts a URL-friendly category back to a display-friendly format.
 * Example: "non-fiction" -> "non fiction"
 * @param {string} url
 * @returns {string}
 */
export function formatUrlToCategory(url) {
  return url.replace(/-/g, " ");
}
