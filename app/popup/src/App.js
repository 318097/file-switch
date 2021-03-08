import React, { useState, useReducer, useEffect, useRef } from "react";
import "./App.scss";
import { Card, Icon, Button, Select } from "@codedrops/react-ui";
import axios from "axios";
import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./state";
import { getDataFromStorage, setDataInStorage } from "./utils";

import Settings from "./components/Settings";
import Auth from "./components/Auth";
import Home from "./components/Home";

axios.defaults.baseURL = config.FUNCTIONS_URL;
axios.defaults.headers.common["external-source"] = "FLASH";

const navItems = [{ label: "HOME" }, { label: "SETTINGS" }, { label: "AUTH" }];

const App = () => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    process("LOAD", true);
  }, []);

  useEffect(() => {
    if (!state.session) return;
    process("SAVE");
  }, [state.session]);

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...data, isLoggedIn: true, token },
      });
    } catch (err) {
      logout();
      console.log("Error: ", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
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
      payload: { session: {} },
    });
    setActivePage("AUTH");
    setAppLoading(false);
    setLoading(false);
    setDataInStorage(undefined, initialState);
  };

  const process = (action, initialLoad) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(undefined, (state) => {
          dispatch({ type: constants.SET_KEY, payload: state });

          const { session } = state;
          const { token } = session || {};
          if (initialLoad) {
            axios.defaults.headers.common["authorization"] = token;
            dispatch({
              type: constants.SET_KEY,
              payload: { activePage: "HOME", appLoading: false },
            });
          }
          if (!token) {
            setActivePage("AUTH");
            setLoading(false);
          }
          // else isAccountActive(token);
        });
      } else {
        console.log("saved:", state);
        setDataInStorage(undefined, state);
      }
    } catch (err) {
      console.log("Error: ", err);
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
      {/* {(loading || appLoading) && <div className="loader" />} */}
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
  const { activePage, activeCollectionId } = state;

  const Controls = () => {
    switch (activePage) {
      case "HOME":
        const options = Object.entries(
          _.get(state, "session.notesApp", {})
        ).map(([id, config]) => ({
          value: id,
          label: _.get(config, "name", ""),
        }));
        return (
          <Select
            style={{ width: "max-content" }}
            options={options}
            placeholder="Collection"
            value={activeCollectionId}
            onChange={(e, activeCollectionId) =>
              dispatch({ type: "SET_KEY", payload: { activeCollectionId } })
            }
          />
        );
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
      <div className="header">
        <nav>
          {navItems.map(({ label }) => (
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
    case "AUTH":
      return <Auth {...rest} />;
    case "HOME":
    default:
      return <Home {...rest} />;
  }
};

export default App;
