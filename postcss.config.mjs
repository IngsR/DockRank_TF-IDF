/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // Mengaktifkan plugin Tailwind CSS
    autoprefixer: {}, // Mengaktifkan plugin Autoprefixer untuk menambahkan prefix vendor otomatis
  },
};

export default config;
