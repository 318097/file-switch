import React, { useState, useReducer, useEffect } from "react";
import "./App.scss";
import { Card } from "@codedrops/react-ui";
import axios from "axios";
import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./state";
import { getDataFromStorage, setDataInStorage } from "./lib/storage";
import handleError from "./lib/errorHandling";
import Settings from "./components/Settings";
import History from "./components/History";
import Auth from "./components/Auth";
import AddItem from "./components/AddItem";
import Header from "./components/Header";
import ErrorBoundary from "./ErrorBoundaries";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "FLASH";
axios.defaults.headers.post["Content-Type"] = "application/json";

const KEYS_TO_SAVE = ["session", "activeCollectionId", "activePage", "history"];

const App = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { appLoading, session, activeCollectionId, activePage, history } =
    state;

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    save();
  }, [session, activeCollectionId, activePage, history]);

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
    setInitLoading(false);
    setDataInStorage(initialState);
  };

  const load = () => {
    getDataFromStorage(async (state = {}) => {
      try {
        // console.log("loaded:", state);
        dispatch({ type: constants.SET_KEY, payload: state });
        const token = _.get(state, "session.token");
        let activeTab = "AUTH";
        if (token) {
          await isAccountActive(token);
          axios.defaults.headers.common["authorization"] = token;
          activeTab = "HOME";
        }
        dispatch({
          type: constants.SET_ACTIVE_PAGE,
          payload: activeTab,
        });
      } catch (error) {
        handleError(error);
        logout();
      } finally {
        setInitLoading(false);
      }
    });
  };

  const save = () => {
    if (initLoading || appLoading) return;
    const dataToSave = _.pick(state, KEYS_TO_SAVE);
    setDataInStorage(dataToSave);
  };

  return (
    <ErrorBoundary>
      <div className="react-ui flash-container">
        <Card hover={false} className="app-content">
          <Header
            logout={logout}
            state={state}
            activePage={activePage}
            setActivePage={setActivePage}
          />
          {!initLoading && (
            <ActivePage
              state={state}
              dispatch={dispatch}
              activePage={activePage}
              setActivePage={setActivePage}
              setAppLoading={setAppLoading}
            />
          )}
        </Card>
        {(initLoading || appLoading) && <div className="loader" />}
      </div>
    </ErrorBoundary>
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
