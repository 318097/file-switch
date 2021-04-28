import React, { useState, useEffect, Fragment, useRef } from "react";
import { Button, Radio, TextArea, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { debounce } from "lodash";
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
  const searchDbDebounced = useRef();

  const [creationMode, setCreationMode] = useState("SITE");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    searchDbDebounced.current = debounce(searchDb, 3000);
  }, []);

  useEffect(() => {
    if (creationMode !== "SITE") {
      handleChange({ url: "", domainUrl: "" });
      return;
    }

    messenger({ action: "getWebInfo" }, handleChange);
  }, [creationMode]);

  const add = async () => {
    setAppLoading(true);
    try {
      if (!activeCollectionId) return;

      const {
        data: { result },
      } = await axios.post(`/posts?collectionId=${activeCollectionId}`, {
        data: [data],
      });
      clearFields();
      console.log(result);
      dispatch({ type: constants.ADD_TO_HISTORY, payload: result });
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
    } catch (err) {
      console.log(err);
    } finally {
      setAppLoading(false);
    }
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
        <div className="flex mb" style={{ position: "relative" }}>
          <Input
            style={{ width: "100%" }}
            className="input"
            value={title}
            name="title"
            autoComplete="off"
            onChange={(e, value) => {
              handleChange(value);
              searchDbDebounced.current(value);
            }}
            placeholder="Title"
            autoFocus
            onBlur={() => setShowSearchResults(false)}
          />
          {showSearchResults && !!title && (
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
          )}
        </div>
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
            disabled={appLoading || !activeCollectionId}
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
