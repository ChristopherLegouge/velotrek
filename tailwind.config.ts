// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        night:   '#0D1B2A',
        marine:  '#1B4F72',
        blue:    '#2E86C1',
        action:  '#E74C3C',
        amber:   '#F39C12',
        surface: '#F5F7FA',
        ink:     '#1A1A2E',
        muted:   '#4A5568',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
