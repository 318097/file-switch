import React, { useState, useEffect, Fragment } from "react";
import { Button, Radio, TextArea, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { constants, initialData } from "../../state";
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
    messenger({ action: "getWebInfo" }, (info) => {
      console.log(info);
      handleChange(info);
    });
  }, [creationMode]);

  const add = async () => {
    setAppLoading(true);
    try {
      await axios.post(`/create-post-v2?collectionId=${activeCollectionId}`, {
        data: [data],
      });
      handleChange(initialData);
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

  const handleTypeChange = (update) =>
    dispatch({ type: constants.SET_DATA, payload: update });

  const clearFields = () => {
    dispatch({
      type: constants.CLEAR,
    });
  };

  // const showClearButton = itemType !== "TODO" || !!content || !!topic || marked;

  return (
    <div className="add-container">
      <div className="options flex mb">
        <Radio
          options={CREATION_MODE_OPTIONS}
          value={creationMode}
          onChange={(e, value) => setCreationMode(value)}
          className="radio mr"
        />
        {/* <Select
          style={{ marginRight: "4px" }}
          placeholder="Topic"
          dropPosition="top"
          options={topics.map(({ _id, content }) => ({
            label: content,
            value: _id,
          }))}
          value={topic}
          onChange={(e, value) => handleTypeChange({ topic: value })}
        />
        <Checkbox
          style={{ margin: "0 4px 0 0" }}
          label={"Mark as complete"}
          value={marked}
          onChange={(e, value) => handleTypeChange({ marked: value })}
        /> */}
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
