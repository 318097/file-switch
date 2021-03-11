import React, { useState, useEffect, Fragment } from "react";
import { Button, Radio, TextArea, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { constants } from "../../state";
import { messenger } from "../../utils";

const CREATION_MODE_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Quick", value: "QUICK" },
  { label: "Website", value: "SITE" },
];

const AddItem = ({ state, dispatch, setAppLoading }) => {
  const { data, activeCollectionId, appLoading } = state;
  const { title, content, url, domainUrl } = data || {};

  const [creationMode, setCreationMode] = useState("QUICK");

  useEffect(() => {
    if (creationMode !== "SITE") return;
    messenger({ action: "getWebInfo" }, handleChange);
  }, [creationMode]);

  const add = async () => {
    setAppLoading(true);
    try {
      if (!activeCollectionId) return;

      const result = await axios.post(
        `/create-post-v2?collectionId=${activeCollectionId}`,
        {
          data: [data],
        }
      );
      clearFields();
      dispatch({ type: constants.ADD_TO_HISTORY, payload: result.data });
    } catch (err) {
      console.log(err);
    } finally {
      // dispatch({
      //   type: constants.ADD_TODO,
      //   payload: result,
      // });
      setAppLoading(false);
    }
  };

  // const updateTodo = async () => {
  //   setAppLoading(true);
  //   const {
  //     data: { result },
  //   } = await axios.put(`/dot/todos/${editTodo._id}`, {
  //     content,
  //     itemType: "TODO",
  //   });
  //   dispatch({ type: constants.UPDATE_TODO, payload: result });
  //   setAppLoading(false);
  // };

  const handleChange = (data) => {
    dispatch({ type: constants.SET_DATA, payload: data });
  };

  const clearFields = () => {
    dispatch({
      type: constants.CLEAR,
    });
  };

  return (
    <div className="add-container">
      <div className="options flex mb">
        <Radio
          options={CREATION_MODE_OPTIONS}
          value={creationMode}
          onChange={(e, value) => setCreationMode(value)}
          className="radio mr"
        />
        <Button className="btn" onClick={clearFields}>
          Clear
        </Button>
      </div>

      <div className="controls">
        <Input
          className="input mb"
          value={title}
          name="title"
          onChange={(e, value) => handleChange(value)}
          placeholder="Title"
          autoFocus
        />
        {creationMode !== "SINGLE" && (
          <Fragment>
            <TextArea
              value={content}
              name="content"
              onChange={(e, value) => handleChange(value)}
              className="inputbox mb"
              placeholder="Content.."
              rows={5}
            />
            <Input
              className="input mb"
              value={url}
              name="url"
              onChange={(e, value) => handleChange(value)}
              placeholder="URL"
            />
            {creationMode === "SITE" && !!domainUrl && (
              <Input
                className="input mb"
                value={domainUrl}
                name="domainUrl"
                disabled
                placeholder="Domain URL"
              />
            )}
          </Fragment>
        )}
        <div>
          <Button
            disable={appLoading || !activeCollectionId}
            className="btn"
            onClick={add}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
