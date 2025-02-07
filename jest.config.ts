export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    //'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.svg$': 'jest-transformer-svg',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
