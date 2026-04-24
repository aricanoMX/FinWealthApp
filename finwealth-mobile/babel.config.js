module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-worklets/plugin', {}, 'worklets-unique'],
      ['react-native-reanimated/plugin', {}, 'reanimated-unique'],
    ],
  };
};
