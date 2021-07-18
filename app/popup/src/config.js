console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "production";

const getServerURL = ({ isProd = false, serverType = "lambda" } = {}) => {
  const connectToLambda = serverType === "lambda";
  const LAMBDA_PROD =
    "https://bubblegum-lambda.netlify.app/.netlify/functions/api";
  const HEROKU_PROD = "https://bubblegum-server.herokuapp.com/api";
  const LOCAL_SERVER = "http://localhost:7000/api";

  if (isProd) return connectToLambda ? LAMBDA_PROD : HEROKU_PROD;

  return LOCAL_SERVER;
};

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "app",
  DEFAULT_STATE: __TYPE__ === "app",
  STATE_KEY: "flash",
  CONNECTED_TO: isProd ? "LAMBDA" : "LOCAL",
};

export default config;
