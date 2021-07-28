import { StatusBar } from "@codedrops/react-ui";

const notify = (msg, type = "success") => {
  StatusBar.notify(msg);
};

export default notify;
