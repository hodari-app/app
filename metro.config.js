const {getDefaultConfig} = require('@react-native/metro-config');

const {withSentryConfig} = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');

module.exports = withSentryConfig(config);
