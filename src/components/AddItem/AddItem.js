import React, { useState, useEffect, Fragment, useRef } from "react";
import { Button, Radio, TextArea, Input, StatusBar } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import _ from "lodash";
import { constants } from "../../state";
import { messenger } from "../../lib/storage";
import notify from "../../lib/notify";
import handleError from "../../lib/errorHandling";
import config from "../../config";

const CREATION_MODE_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Quick", value: "QUICK" },
  { label: "Website", value: "SITE" },
];

const AddItem = ({ state, dispatch, setAppLoading }) => {
  const { data, activeCollectionId, appLoading } = state;
  const { title, content, url, domain } = data || {};
  const searchDbDebounced = useRef();

  const [creationMode, setCreationMode] = useState("QUICK");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    searchDbDebounced.current = _.debounce(searchDb, 500);
    notify(config.CONNECTED_TO);
  }, []);

  useEffect(() => {
    if (creationMode === "SITE")
      messenger({ action: "getWebInfo" }, handleChange);
    else handleChange({ url: "", domain: "" });
  }, [creationMode]);

  const add = async () => {
    setAppLoading(true);
    try {
      if (!data.title) return notify(`Error: Title is required`);

      const {
        data: { result },
      } = await axios.post(`/posts?collectionId=${activeCollectionId}`, {
        data: [data],
      });
      clearFields();
      dispatch({ type: constants.ADD_TO_HISTORY, payload: result });
      notify(`Success`);
    } catch (error) {
      handleError(error);
    } finally {
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

  const searchDb = async (value) => {
    try {
      setAppLoading(true);
      const result = await axios.get(
        `/posts?collectionId=${activeCollectionId}`,
        {
          params: {
            search: value.title,
          },
        }
      );
      setSearchResults(result.data.posts);
      setShowSearchResults(true);
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const options = _.get(state, "session.notebase", []).map(({ _id, name }) => ({
    value: _id,
    label: name,
  }));

  return (
    <div className="add-container">
      <Radio
        options={options}
        placeholder="Collection"
        value={activeCollectionId}
        onChange={(e, activeCollectionId) =>
          dispatch({ type: "SET_KEY", payload: { activeCollectionId } })
        }
      />

      <div className="flex">
        <Radio
          options={CREATION_MODE_OPTIONS}
          value={creationMode}
          onChange={(e, value) => setCreationMode(value)}
        />
        <Button color="blue" type="link" onClick={clearFields}>
          Clear
        </Button>
      </div>

      <div className="controls">
        <Input
          value={title}
          name="title"
          autoComplete="off"
          onChange={(e, value) => {
            handleChange(value);
            // searchDbDebounced.current(value);
          }}
          placeholder="Title"
          autoFocus
          onBlur={() => setShowSearchResults(false)}
        />
        {/* {showSearchResults && !!title && (
          <div className="search-results">
            {searchResults.length ? (
              searchResults.map(({ index, title, _id }) => (
                <div
                  className="flex item"
                  key={_id}
                >{`${index}. ${title}`}</div>
              ))
            ) : (
              <div className="empty">No search result.</div>
            )}
          </div>
        )} */}
        {creationMode !== "SINGLE" && (
          <Fragment>
            <TextArea
              value={content}
              name="content"
              onChange={(e, value) => handleChange(value)}
              placeholder="Content.."
              rows={5}
            />
            <Input
              autoComplete="off"
              value={url}
              name="url"
              onChange={(e, value) => handleChange(value)}
              placeholder="URL"
            />
            {creationMode === "SITE" && !!domain && (
              <Input
                value={domain}
                name="domain"
                disabled
                placeholder="Domain URL"
              />
            )}
          </Fragment>
        )}
        <div>
          <Button disabled={appLoading || !activeCollectionId} onClick={add}>
            Add
          </Button>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: "100%", bottom: 0 }}>
        <StatusBar style={{ background: "none" }} />
      </div>
    </div>
  );
};

export default AddItem;
