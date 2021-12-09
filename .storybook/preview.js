import "antd/dist/antd.variable.min.css";
import { ConfigProvider } from "antd";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (story) => <ConfigProvider>{story()}</ConfigProvider>,
];
