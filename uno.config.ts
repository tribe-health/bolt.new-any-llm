import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  theme: {
    colors: {
      'bolt-elements': {
        'background': {
          'depth-1': 'var(--bolt-elements-background-depth-1)',
          'depth-2': 'var(--bolt-elements-background-depth-2)',
          'depth-3': 'var(--bolt-elements-background-depth-3)',
          'depth-4': 'var(--bolt-elements-background-depth-4)',
        },
        'borderColor': 'var(--bolt-elements-borderColor)',
        'borderColorActive': 'var(--bolt-elements-borderColorActive)',
        'textPrimary': 'var(--bolt-elements-textPrimary)',
        'textSecondary': 'var(--bolt-elements-textSecondary)',
        'textTertiary': 'var(--bolt-elements-textTertiary)',
        'preview': {
          'addressBar': {
            'background': 'var(--bolt-elements-preview-addressBar-background)',
            'backgroundHover': 'var(--bolt-elements-preview-addressBar-backgroundHover)',
            'backgroundActive': 'var(--bolt-elements-preview-addressBar-backgroundActive)',
            'text': 'var(--bolt-elements-preview-addressBar-text)',
            'textActive': 'var(--bolt-elements-preview-addressBar-textActive)',
          },
        },
      },
    },
  },
})
