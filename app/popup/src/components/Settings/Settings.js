import React, { useEffect, useState, Fragment } from "react";
import colors, {
  Card,
  Icon,
  Button,
  Radio,
  Input,
  Select,
} from "@codedrops/react-ui";
import _ from "lodash";
import axios from "axios";
import "./Settings.scss";
import config from "../../config";

const Settings = ({ state, dispatch, setAppLoading }) => {
  const [projectName, setProjectName] = useState("");
  const { activeCollectionId, session = {}, topics = [], appLoading } = state;
  const { username, name, email } = session || {};

  return (
    <section id="settings">
      <div className="block">
        <h3>Basic</h3>
        <div className="wrapper">
          Name:&nbsp;
          <span>{name}</span>
        </div>
        <div className="wrapper">
          Username:&nbsp;
          <span>{`@${username}`}</span>
        </div>
        <div className="wrapper">
          Email:&nbsp;
          <span>{email}</span>
        </div>
      </div>
    </section>
  );
};

export default Settings;
