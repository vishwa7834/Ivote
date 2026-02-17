/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#8B5CF6', // Violet-500
                secondary: '#EC4899', // Pink-500
                accent: '#06B6D4', // Cyan-500
                dark: '#0F172A', // Slate-900 (Deep Blue-Black)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
