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
import { constants } from "../../state";
import { getActiveProject } from "../../helpers";
import config from "../../config";

const Settings = ({ state, dispatch, setAppLoading }) => {
  const [projectName, setProjectName] = useState("");
  // const [showInfo, setShowInfo] = useState(false);
  const { activeProjectId, session = {}, topics = [], appLoading } = state;
  const { username, name, email } = session || {};

  const createNewProject = async () => {
    setAppLoading(true);
    const { data } = await axios.post("/dot/projects", {
      name: projectName,
    });
    dispatch({ type: constants.SET_SESSION, payload: data });
    // setShowInfo(true);
    setAppLoading(false);
  };

  const updateTopic = async (id, update) => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/topics/${id}`, update);
    dispatch({ type: constants.UPDATE_TOPIC, payload: result });
    // setShowInfo(true);
    setAppLoading(false);
  };

  const saveToLocalStorage = () => {
    setAppLoading(true);
    localStorage.setItem(config.LOCAL_PROJECT_KEY, activeProjectId);
    setAppLoading(false);
  };

  const clearFromLocalStorage = () => {
    setAppLoading(true);
    localStorage.removeItem(config.LOCAL_PROJECT_KEY);
    setAppLoading(false);
  };

  const projects = _.get(state, "session.dot", []);
  let metaProjectName;
  let storageProjectName;

  const project = getActiveProject();

  const projectList = projects.map(({ _id, name }) => {
    if (_id === project.metaTag) metaProjectName = name;
    if (_id === project.storage) storageProjectName = name;
    return {
      label: name,
      value: _id,
    };
  });

  const hasActiveStorageProject =
    activeProjectId && project.storage === activeProjectId;
  const hasActiveMetaTagProject =
    activeProjectId && project.metaTag === activeProjectId;

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

      <div className="block">
        <h3>Active Project</h3>
        <div style={{ display: "flex" }}>
          <Select
            // style={{ width: "max-content" }}
            placeholder="Select Project"
            options={projectList}
            value={activeProjectId}
            onChange={(e, value) =>
              dispatch({
                type: constants.SET_ACTIVE_PROJECT_ID,
                payload: value,
              })
            }
          />
        </div>
      </div>

      <div className="block">
        <h3>Active Project Meta</h3>

        <div className="wrapper">
          Project Detected (STORAGE):&nbsp;
          <span>{storageProjectName || "-"}</span>
          {hasActiveStorageProject && <Icon size={10} type="check-2" />}
        </div>

        {activeProjectId && (
          <div className="flex center" style={{ marginBottom: "20px" }}>
            <Button
              className="btn mr"
              onClick={saveToLocalStorage}
              disabled={hasActiveStorageProject}
            >
              {hasActiveStorageProject ? "Saved" : "Save to Local Storage"}
            </Button>
            {hasActiveStorageProject && (
              <Button className="btn" onClick={clearFromLocalStorage}>
                Clear
              </Button>
            )}
          </div>
        )}

        <div className="wrapper">
          Project Detected (META TAG):&nbsp;
          <span>{metaProjectName || "-"}</span>
          {hasActiveMetaTagProject && <Icon size={10} type="check-2" />}
        </div>

        {activeProjectId && (
          <Fragment>
            <div className="mb">
              {project.metaTag === activeProjectId
                ? "Meta tag detected"
                : "Paste the following tag in 'index.html':"}
            </div>
            <div className="copy-code">
              <span>{`<meta title="dot" content="${activeProjectId}"/>`}</span>
            </div>
          </Fragment>
        )}
      </div>

      {activeProjectId && (
        <div className="block">
          <h3>Project Topics</h3>
          <div>
            {topics.map(({ _id, content, visible, isDefault }, index) => (
              <Card key={_id} className="topic-wrapper">
                <div className="content">{`${index + 1}. ${content}`}</div>
                {!isDefault && (
                  <div className="actions">
                    <Radio
                      size="sm"
                      options={[
                        { label: "Show", value: true },
                        { label: "Hide", value: false },
                      ]}
                      value={visible}
                      onChange={(e, value) =>
                        updateTopic(_id, { visible: value })
                      }
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="block">
        <h3>Create new Project</h3>
        <div className="new-project">
          <Input
            autoFocus={false}
            value={projectName}
            onChange={(e, value) => setProjectName(value)}
            className="inputbox"
            placeholder="Project Name"
          />
          <Button
            disabled={appLoading}
            className="btn ml"
            onClick={createNewProject}
          >
            Create
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
