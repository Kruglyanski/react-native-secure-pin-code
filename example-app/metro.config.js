const path = require("path");
const { getDefaultConfig } = require("@react-native/metro-config");

const monorepoRoot = path.resolve(__dirname, "..");
const packagesRoot = path.resolve(monorepoRoot, "packages");

const config = getDefaultConfig(__dirname);

config.watchFolders = [
  monorepoRoot,
  packagesRoot,
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = true;

module.exports = config;

