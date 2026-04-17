import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'] },

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // удобно, чтобы не ругался на намеренно неиспользуемые аргументы
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
])