import React, { useState, useEffect } from "react";
import { Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./Auth.scss";
import { constants } from "../../state";
import config from "../../config";

const Auth = ({ state, dispatch, setActivePage, setAppLoading }) => {
  const [data, setData] = useState({ username: "", password: "" });
  const { appLoading } = state;

  useEffect(() => {}, []);

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    setAppLoading(true);
    try {
      const { data: result } = await axios.post(
        `${config.SERVER_URL}/auth/login`,
        data
      );
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...result, isLoggedIn: true },
      });
      setActivePage("DOT");
    } catch (err) {
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <section id="auth">
      <div className="container">
        <h3>Login</h3>
        <Input
          className="inp"
          placeholder="Username"
          name="username"
          value={data.username}
          onChange={(_, value) => setInputData(value)}
        />
        <Input
          type="password"
          className="inp"
          placeholder="Password"
          name="password"
          value={data.password}
          onChange={(_, value) => setInputData(value)}
        />
        <div className="button-wrapper">
          <Button onClick={handleAuth} className="btn" disabled={appLoading}>
            Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Auth;
