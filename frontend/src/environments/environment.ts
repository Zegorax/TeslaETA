const env = (window as any).env || {};
export const environment = {
    apiUrl: env["apiUrl"] || "default",
    mapboxToken: env["mapboxToken"] || ""
};
