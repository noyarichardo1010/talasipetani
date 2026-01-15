module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@services': './src/services',
          '@assets': './src/assets',
          '@utils': './src/utils',
          '@components': './src/components',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
