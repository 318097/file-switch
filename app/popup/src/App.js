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
import AddItem from "./components/AddItem";

axios.defaults.baseURL = config.FUNCTIONS_URL;
axios.defaults.headers.common["external-source"] = "FLASH";

const NAV_ITEMS = (isLoggedIn) =>
  [
    { label: "HOME", visible: isLoggedIn },
    { label: "SETTINGS", visible: isLoggedIn },
    { label: "AUTH", visible: !isLoggedIn },
  ].filter((item) => item.visible);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  // const stateRef = useRef();

  // useEffect(() => {
  //   stateRef.current = state;
  // }, [state]);

  useEffect(() => {
    process("LOAD");
  }, []);

  useEffect(() => {
    if (loading) return;

    process("SAVE");
  }, [state]);

  // const isAccountActive = async (token) => {
  //   try {
  //     axios.defaults.headers.common["authorization"] = token;

  //     const { data } = await axios.post(`/auth/account-status`);
  //     dispatch({
  //       type: constants.SET_SESSION,
  //       payload: { ...data, isLoggedIn: true, token },
  //     });
  //   } catch (err) {
  //     logout();
  //     console.log("Error: ", err);
  //   } finally {
  //     setTimeout(() => setLoading(false), 500);
  //   }
  // };

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

  const process = (action) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(undefined, (state) => {
          console.log("loaded:", state);
          dispatch({ type: constants.SET_KEY, payload: state });

          const { session } = state;
          const { token } = session || {};

          let activeTab;
          if (token) {
            axios.defaults.headers.common["authorization"] = token;
            activeTab = "HOME";
          } else {
            activeTab = "AUTH";
          }
          dispatch({
            type: constants.SET_ACTIVE_PAGE,
            payload: activeTab,
          });
          // else isAccountActive(token);
        });
      } else {
        console.log("saved:", state);
        setDataInStorage(undefined, state);
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
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
  const { activePage, activeCollectionId, session } = state;
  const { token } = session || {};

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
    case "AUTH":
      return <Auth {...rest} />;
    case "HOME":
    default:
      return <AddItem {...rest} />;
  }
};

export default App;
