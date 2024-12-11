/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zeus: {
          lightning: '#00FFFF',
          gold: '#FFD700',
          brown: '#8B4513',
          light: {
            background: '#FFFFFF',
            surface: '#F8FAFC',
            border: '#E2E8F0',
            text: {
              primary: '#1A202C',
              secondary: '#4A5568',
              accent: '#00FFFF'
            }
          },
          dark: {
            background: '#1A202C',
            surface: '#2D3748',
            border: '#4A5568',
            text: {
              primary: '#FFFFFF',
              secondary: '#A0AEC0',
              accent: '#00FFFF'
            }
          }
        }
      },
      backgroundImage: {
        'zeus-hero': "url('/zeus_lightening.png')",
        'zeus-pattern': "linear-gradient(to right, rgba(26, 32, 44, 0.5), rgba(26, 32, 44, 0.5)), url('/zeus_lightening.png')"
      },
      boxShadow: {
        'zeus': '0 0 15px rgba(0, 255, 255, 0.5)',
        'zeus-gold': '0 0 15px rgba(255, 215, 0, 0.5)'
      }
    }
  },
  plugins: []
};
