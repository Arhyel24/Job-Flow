const { getDefaultConfig } = require("@expo/metro-config");

const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    unstable_enablePackageExports: false,
    drop_console: true,
  },
  projectRoot,
};
