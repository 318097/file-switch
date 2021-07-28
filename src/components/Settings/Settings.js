import React from "react";
import "./Settings.scss";

const Settings = ({ state }) => {
  // const [projectName, setProjectName] = useState("");
  const { session = {} } = state;
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
