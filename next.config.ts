import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["arla-roomiest-iconoclastically.ngrok-free.dev"],
  // Evitar que Webpack intente empaquetar los workers de tesseract.js y soporte para pdfkit
  serverExternalPackages: ["pdfkit", "fontkit", "restructure", "deep-equal", "tesseract.js"],
  /* config options here */
};

export default nextConfig;

