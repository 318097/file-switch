import React, { useState } from "react";
import { Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./Auth.scss";
import { constants } from "../../state";

const Auth = ({ state, dispatch, setActivePage, setAppLoading }) => {
  const [data, setData] = useState({ username: "", password: "" });
  const { appLoading } = state;

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    setAppLoading(true);
    try {
      const { data: result } = await axios.post(`/auth/login`, data);
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...result, isAuthenticated: true },
      });
      setActivePage("HOME");
      axios.defaults.headers.common["authorization"] = result.token;
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
