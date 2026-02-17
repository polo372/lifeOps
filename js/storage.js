// storage.js

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function load(key, defaultValue = null) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}
