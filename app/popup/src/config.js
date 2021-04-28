console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "PRODUCTION";
const connectionSource = ""; // 'LAMBDA' or 'HEROKU'

const config = {
  SERVER_URL:
    connectionSource === "LAMBDA"
      ? "https://bubblegum-serverless.netlify.app/.netlify/functions/api"
      : isProd
      ? "https://bubblegum-server.herokuapp.com/api"
      : "http://localhost:7000/api",
  IS_LOCAL_STORAGE: __TYPE__ === "APP",
  DEFAULT_STATE: __TYPE__ === "APP",
  STATE_KEY: "flash",
  CONNECTED_TO: isProd
    ? "PROD"
    : connectionSource === "LAMBDA"
    ? "LAMBDA"
    : "LOCAL",
  // TOKEN: process.env.TOKEN,
};

export default config;
