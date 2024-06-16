module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'inline-import',
      {
        extensions: ['.sql'],
      },
    ],
  ],
};
