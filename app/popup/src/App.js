import React, { useState, useReducer, useEffect, useRef } from "react";
import "./App.scss";
import { Card, Icon, Button, Checkbox, Tag } from "@codedrops/react-ui";
import axios from "axios";
import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./state";
import { getDataFromStorage, setDataInStorage } from "./utils";
import { getActiveProject } from "./helpers";

import Settings from "./components/Settings";
import Auth from "./components/Auth";
import Home from "./components/Home";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "FLASH";

const navItems = ({ isLoggedIn }) =>
  [
    { label: "HOME", visible: isLoggedIn },
    { label: "SETTINGS", visible: isLoggedIn },
    { label: "AUTH", visible: !isLoggedIn },
  ].filter(({ visible }) => visible);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      console.log("Error: isAccountActive(): ", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const setActiveProject = () => {
    const keys = getActiveProject();
    dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: keys.active });
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

  const process = (action, newData) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(undefined, (state) => {
          // console.log("loaded:: state::-", state);
          dispatch({ type: constants.SET_KEY, state });

          const { session } = state;
          const { token } = session || {};
          if (!token) {
            setActivePage("AUTH");
            setLoading(false);
          } else isAccountActive(token);
        });
      } else {
        // console.log("saved:: state::-", state);
        setDataInStorage(undefined, newData || state);
      }
    } catch (err) {
      console.log("Error: process(): ", err);
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
  const {
    activePage,
    activeProjectId,
    pendingTasksOnly,
    session = {},
    isProjectIdValid,
  } = state;
  const { isLoggedIn } = session;

  useEffect(() => {
    // const fetchData = async () => {
    //   const {
    //     data: { todos = [], topics = [] },
    //   } = await axios.get(`/dot/todos?projectId=${activeProjectId}`);
    //   dispatch({ type: constants.SET_TOPICS, payload: topics });
    //   dispatch({ type: constants.SET_TODOS, payload: todos });
    // };

    if (!isLoggedIn) return;
    fetchData();
  }, [isLoggedIn]);

  const Controls = () => {
    switch (activePage) {
      case "DOT":
        return (
          <Checkbox
            style={{ margin: "0" }}
            label={"Pending Tasks"}
            value={pendingTasksOnly}
            onChange={(e, value) =>
              dispatch({
                type: constants.SET_KEY,
                payload: { pendingTasksOnly: value },
              })
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
          {navItems({ isLoggedIn }).map(({ label }) => (
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
        <div className="extra-controls">{/* <Controls /> */}</div>
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

      {/* {isLoggedIn && (
        <Tag className="project-name">{`${
          !isProjectIdValid && activeProjectId
            ? "Invalid Project Id"
            : projectName.current
            ? projectName.current
            : "No active project"
        }`}</Tag>
      )} */}
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
