// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Habilitar PWA en todos los modos (produción y npm start)
  // Desabilitar solo cuando explícitamente se pasa DISABLE_PWA=true
  disable: process.env.DISABLE_PWA === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {},
  // Orígenes permitidos durante desarrollo
  // Habilitados: localhost, IP local, y ngrok
  allowedDevOrigins: [
    'localhost',
    '192.168.1.13',
    'arla-roomiest-iconoclastically.ngrok-free.dev',
  ],
};

module.exports = withPWA(nextConfig);
