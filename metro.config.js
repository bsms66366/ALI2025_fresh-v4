const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add asset extensions
config.resolver.assetExts.push('glb', 'gltf', 'obj', 'mtl');

// Configure asset folder
const assetPath = `${__dirname}/assets`;

// Add watch folder
config.watchFolders = [
  ...(config.watchFolders || []),
  assetPath
];

// Add asset root
config.resolver.assetRoots = [
  ...(config.resolver.assetRoots || []),
  assetPath
];

module.exports = config;
