import type { Preview } from "@storybook/react-vite";

import "../src/index.css";

import { TooltipProvider } from "../src/components/ui/tooltip";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "playfield",
      values: [
        {
          name: "playfield",
          value: "#09101b"
        },
        {
          name: "tabletop",
          value: "#141f31"
        },
        {
          name: "parchment",
          value: "#f5efe4"
        }
      ]
    },
    a11y: {
      test: "error"
    },
    options: {
      storySort: {
        order: ["Docs", "Shell", "Game UI", "Primitives"]
      }
    }
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = "dark";

      const isFullscreen = context.parameters.layout === "fullscreen";

      return (
        <TooltipProvider delayDuration={120}>
          <div
            data-theme="dark"
            className={isFullscreen ? "min-h-screen bg-background text-foreground" : "min-h-screen bg-background p-6 text-foreground"}
          >
            <Story />
          </div>
        </TooltipProvider>
      );
    }
  ]
};

export default preview;
