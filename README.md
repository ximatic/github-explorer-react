# GitHub Explorer

# Solution

## Start && access application

- To start application execute following commands in project's directory
  - `npm install`
  - `npm run dev`
- Application, by default, should be accessible via **http://localhost:5173**

## Design

- Application is divided into 2 main sections:
  - Header with "logo", title and "logout" button to reset Token (only visible on Repositories and Repository routes)
  - Main content according to current route
- There are 3 routes available
  - `/` - is used to provide GitHub API Token (default route)
  - `/repositories` - list of public repositories
  - `/:owner/:name` - list issues of selected repository with basic information
  - using any other route causes redirection to default `/` one

## Features

- Verify validity of GitHub API Token
- List of public GitHub repositories sorted by start count
- Repository information with list of its issues sorted by date

## Libraries

Solution is using following 3rd party libraries (on top of the latest Reac 19):

- PrimeNG - to create unified design for UI components
- Tailwind CSS - to simplify usage of basic CSS classes
- Redux - for state management
- Apollo - for GraphQL requests

## Alternatives

Same application, but written in Angular, is available at [GitHub](https://github.com/ximatic/github-explorer)

## TODO

TODOs:

- Add error handling (e.g. for GraphQL resuests)
- Improve unit tests
- Add E2E tests
- Implement more advanced RWD
- Add application configuration for better handling multiple environments (staging/integration/production/etc.)

## Default documentation

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
