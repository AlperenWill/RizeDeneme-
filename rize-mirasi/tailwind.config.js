/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tasarım dili (Referans Görsel 2)
        uzay: '#090B11', // Ana arka plan
        kart: '#101624', // Kart yüzeyleri
        vurgu: '#F04448', // Kırmızı vurgu / hotspot
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(110%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.35)', opacity: '0.5' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
          '60%': { transform: 'scale(1.2) rotate(6deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
        breathe: 'breathe 2s ease-in-out infinite',
        badgePop: 'badgePop 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
