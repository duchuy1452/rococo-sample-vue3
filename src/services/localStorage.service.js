export default {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  getItem(key) {
    const item = localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item)
    } catch (e) {
      console.warn(`Error parsing localStorage item with key "${key}":`, e)
      return null
    }
  },
  clear() {
    localStorage.clear();
  }
}
