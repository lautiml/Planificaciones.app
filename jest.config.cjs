module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    moduleFileExtensions: ['js', 'jsx', 'mjs'],
    transformIgnorePatterns: ['/node_modules/'],
};