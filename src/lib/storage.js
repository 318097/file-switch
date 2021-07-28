import * as lib from "@codedrops/lib";
import config from "../config";

const messenger = (payload, cb) => {
  if (__TYPE__ === "ext") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      chrome.tabs.sendMessage(tabs[0].id, payload, cb)
    );
  } else
    cb({
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
    });
};

const getDataFromStorage = (cb) => {
  if (config.IS_LOCAL_STORAGE) {
    const data = lib.getDataFromStorage(config.STATE_KEY);
    cb(data);
  } else {
    chrome.storage.local.get([config.STATE_KEY], (data = {}) =>
      cb(data[config.STATE_KEY])
    );
  }
};

const setDataInStorage = (value) => {
  if (config.IS_LOCAL_STORAGE) {
    lib.setDataInStorage(config.STATE_KEY, value);
  } else {
    chrome.storage.local.set({ [config.STATE_KEY]: value });
  }
};

export { messenger, getDataFromStorage, setDataInStorage };
