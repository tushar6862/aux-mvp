/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',

    // Or if using `src` directory:
    './src/**/*.{js,jsx}',
  ],
    theme: {
      screens: {
        monitor: '1800px',
        desktop: '1200px',
        tablet: '900px',
        mobile: '600px',
        'small-mobile': '400px',
        'max-monitor': { max: '1800px' },
        'max-desktop': { max: '1200px' },
        'max-tablet': { max: '900px' },
        'max-mobile': { max: '600px' },
        'max-small-mobile': { max: '400px' },
      },
    },
  plugins: [],
};
