export const retrieveServerHealth = async () => {
  // Use Primitive
  return fetch(import.meta.env.VITE_API_BASE_URL + 'health');
};
