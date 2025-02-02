// import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default ({ ignores: ['node_modules', 'dist'] },
{
  languageOptions: {
    parser: tsparser,
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: {
    '@typescript-eslint': tseslint,
    prettier
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error']
  }
});
