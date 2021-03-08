console.log("CONFIG:", __TYPE__, __ENV__);

// const isProd = __ENV__ === "PRODUCTION";
const isProd = true;

const config = {
  SERVER_URL: isProd
    ? "https://bubblegum-server.herokuapp.com/api"
    : "http://localhost:7000/api",
  FUNCTIONS_URL: isProd
    ? "https://bubblegum-serverless.netlify.app/.netlify/functions"
    : "http://localhost:8888/.netlify/functions",
  IS_LOCAL_STORAGE: __TYPE__ === "APP",
  DEFAULT_STATE: __TYPE__ === "APP",
  STATE_KEY: "flash",
  TOKEN: process.env.TOKEN,
};

export default config;
