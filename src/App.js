import React, { useState, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Button } from "@codedrops/react-ui";
import axios from "axios";
// import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./state";
import { getDataFromStorage, setDataInStorage } from "./lib/storage";

import Settings from "./components/Settings";
import History from "./components/History";
import Auth from "./components/Auth";
import AddItem from "./components/AddItem";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "FLASH";
axios.defaults.headers.post["Content-Type"] = "application/json";

const NAV_ITEMS = (isAuthenticated) =>
  [
    { label: "HOME", visible: isAuthenticated },
    { label: "SETTINGS", visible: isAuthenticated },
    { label: "HISTORY", visible: isAuthenticated },
    { label: "AUTH", visible: !isAuthenticated },
  ].filter((item) => item.visible);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    process("LOAD");
  }, []);

  useEffect(() => {
    if (loading) return;

    process("SAVE");
  }, [
    state.session,
    state.activeCollectionId,
    state.activePage,
    state.history,
  ]);

  const isAccountActive = async (token) => {
    axios.defaults.headers.common["authorization"] = token;

    const { data } = await axios.post(`/auth/account-status`);
    dispatch({
      type: constants.SET_SESSION,
      payload: { ...data, isAuthenticated: true, token },
    });
  };

  const setActivePage = (page) =>
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page,
    });

  const setAppLoading = (status) =>
    dispatch({
      type: constants.SET_LOADING,
      payload: status,
    });

  const logout = () => {
    dispatch({
      type: constants.SET_KEY,
      payload: initialState,
    });
    setActivePage("AUTH");
    setAppLoading(false);
    setLoading(false);
    setDataInStorage(initialState);
  };

  const process = (action) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(async (state = {}) => {
          try {
            console.log("loaded:", state);
            dispatch({ type: constants.SET_KEY, payload: state });

            const { session } = state;
            const { token } = session || {};

            let activeTab;
            if (token) {
              await isAccountActive(token);
              axios.defaults.headers.common["authorization"] = token;
              activeTab = "HOME";
            } else {
              activeTab = "AUTH";
            }
            dispatch({
              type: constants.SET_ACTIVE_PAGE,
              payload: activeTab,
            });
          } catch (err) {
            logout();
          }
        });
      } else {
        console.log("saved:", state);
        delete state.appLoading;
        setDataInStorage(state);
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const { appLoading } = state;

  return (
    <div className="react-ui dot-container">
      <AppContent
        loading={loading}
        state={state}
        dispatch={dispatch}
        setActivePage={setActivePage}
        setAppLoading={setAppLoading}
        logout={logout}
      />
      {(loading || appLoading) && <div className="loader" />}
    </div>
  );
};

const AppContent = ({
  loading,
  state,
  dispatch,
  setActivePage,
  setAppLoading,
  logout,
}) => {
  const { activePage, session } = state;
  const { token } = session || {};

  const Controls = () => {
    switch (activePage) {
      case "SETTINGS":
        return (
          <Button className="btn" onClick={logout}>
            Logout
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="card app-content">
      <div className="header mb">
        <nav>
          {NAV_ITEMS(!!token).map(({ label }) => (
            <span
              key={label}
              className={`nav-item ${
                activePage === label ? "active-page" : ""
              }`}
              onClick={() => setActivePage(label)}
            >
              {label}
            </span>
          ))}
        </nav>
        <div className="extra-controls">
          <Controls />
        </div>
      </div>
      {!loading && (
        <ActivePage
          state={state}
          dispatch={dispatch}
          activePage={activePage}
          setActivePage={setActivePage}
          setAppLoading={setAppLoading}
        />
      )}
    </Card>
  );
};

const ActivePage = ({ activePage, ...rest }) => {
  switch (activePage) {
    case "SETTINGS":
      return <Settings {...rest} />;
    case "HISTORY":
      return <History {...rest} />;
    case "AUTH":
      return <Auth {...rest} />;
    case "HOME":
    default:
      return <AddItem {...rest} />;
  }
};

export default App;
