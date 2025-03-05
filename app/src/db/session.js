export const isInSession = () => Boolean(localStorage.getItem('session'))
/**
 * @param {string} book
 * @param {number} chapter
 * @param {GeoLocation[]} path
 * @param {number} currentLocation
 * @param {boolean} group
 */
export const updateSession = ( book, chapter, path, currentLocation, group ) => {
      localStorage.setItem( 'session', JSON.stringify({ book, path, chapter, currentLocation, group }))
}

/**
 * @returns {Session}
 */
export const getSession = () => JSON.parse( localStorage.getItem('session') );

export const endSession = () => localStorage.removeItem('session');