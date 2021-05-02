console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "PRODUCTION";

const config = {
  SERVER_URL: isProd
    ? "https://bubblegum-lambda.netlify.app/.netlify/functions/api"
    : "http://localhost:7000/api",
  IS_LOCAL_STORAGE: __TYPE__ === "APP",
  DEFAULT_STATE: __TYPE__ === "APP",
  STATE_KEY: "flash",
  CONNECTED_TO: isProd ? "LAMBDA" : "LOCAL",
  // TOKEN: process.env.TOKEN,
};

export default config;
