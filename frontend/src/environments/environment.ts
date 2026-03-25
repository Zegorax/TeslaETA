// This file should never be used.
const env = (window as any).env || {};
export const environment = {
    apiUrl: env["apiUrl"] || "default",
    wsUrl: env["wsUrl"] || "",
    mapboxToken: env["mapboxToken"] || "",
};
