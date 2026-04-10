/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // هنستخدمه بعدين مع التوجل
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",     // أبيض
        secondary: "#000000",   // أسود
      },
    },
  },
  plugins: [],
}