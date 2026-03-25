
// This file should never be used.
// In angular.json, file replacements will use directly environment.development.ts
export const environment = {
  production: false,
  apiUrl: window["env"]["apiUrl"] || "default",
  mapboxToken: window["env"]["mapboxToken"] || false
};