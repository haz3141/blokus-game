import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const reactViteFramework = fileURLToPath(new URL("../node_modules/@storybook/react-vite", import.meta.url));
const addonDocs = fileURLToPath(new URL("../node_modules/@storybook/addon-docs", import.meta.url));
const addonA11y = fileURLToPath(new URL("../node_modules/@storybook/addon-a11y", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [addonDocs, addonA11y],
  framework: {
    name: reactViteFramework,
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  async viteFinal(config) {
    config.plugins = (config.plugins ?? []).flat(Infinity).filter((plugin) => {
      const pluginName = typeof plugin === "object" && plugin && "name" in plugin ? String(plugin.name) : "";

      return !pluginName.includes("vite-plugin-pwa");
    });

    return config;
  }
};

export default config;
