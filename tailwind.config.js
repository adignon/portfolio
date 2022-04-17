module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,css}",
    "./app/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
   
    extend: {
      fontSize:{
        "header":"68px"
      },
      colors:{
        primary:{
          DEFAULT: '#1BD5FF',
          '50': '#D3F7FF',
          '100': '#BEF3FF',
          '200': '#95ECFF',
          '300': '#6DE4FF',
          '400': '#44DDFF',
          '500': '#1BD5FF',
          '600': '#00B8E2',
          '700': '#008BAA',
          '800': '#005D72',
          '900': '#002F3A'
        },
        'secondary': {
          DEFAULT: '#FF491B',
          '50': '#FFDCD3',
          '100': '#FFCBBE',
          '200': '#FFAB95',
          '300': '#FF8A6D',
          '400': '#FF6A44',
          '500': '#FF491B',
          '600': '#E22E00',
          '700': '#AA2200',
          '800': '#721700',
          '900': '#3A0C00'
        },
      },
      transitionProperty: {
        'size': 'height, width',
        'width':"width",
        'height':"height",
        'spacing': 'margin, padding',
        'border': 'border',
        'input-label':"top, font-size, border-color",
      },
    },
  },
  plugins: [],
}