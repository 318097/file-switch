import { getServerURL } from "@codedrops/lib";

console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "production";

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "app",
  DEFAULT_STATE: __TYPE__ === "app",
  STATE_KEY: "flash",
  CONNECTED_TO: isProd ? "LAMBDA" : "LOCAL",
};

export default config;
