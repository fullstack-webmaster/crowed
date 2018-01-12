/**
 *
 * @returns {string}
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * Generate random GUID, related to task https://trello.com/c/ms44qB4Z/48-force-directed-graph-not-clearing-old-network-when-new-category-chosen
 *
 * @returns {string}
 */
export default function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}