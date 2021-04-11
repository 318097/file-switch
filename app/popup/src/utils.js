import config from "./config";

function messenger(payload, cb) {
  if (__TYPE__ === "EXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      chrome.tabs.sendMessage(tabs[0].id, payload, cb)
    );
  } else
    cb({
      title: document.title,
      url: window.location.href,
      domainUrl: window.location.hostname,
    });
}

function getDataFromStorage(key = config.STATE_KEY, cb) {
  if (config.IS_LOCAL_STORAGE) {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    cb(data);
  } else {
    chrome.storage.local.get([key], (data = {}) => cb(data[key]));
  }
}

function setDataInStorage(key = config.STATE_KEY, value) {
  if (config.IS_LOCAL_STORAGE) {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    );
  } else {
    chrome.storage.local.set({ [key]: value });
  }
}

export { messenger, getDataFromStorage, setDataInStorage };
