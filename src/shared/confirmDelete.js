export function confirmDelete(resourceName) {
  return window.confirm(`Are you sure you want to delete this ${resourceName}? This action cannot be undone.`);
}
