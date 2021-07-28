import React, { useState, useEffect, Fragment, useRef } from "react";
import colors, {
  Button,
  Radio,
  TextArea,
  Input,
  StatusBar,
} from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import _ from "lodash";
import { constants } from "../../state";
import { messenger } from "../../lib/utils";
import config from "../../config";

const CREATION_MODE_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Quick", value: "QUICK" },
  { label: "Website", value: "SITE" },
];

const { triggerEvent } = StatusBar;

const AddItem = ({ state, dispatch, setAppLoading }) => {
  const { data, activeCollectionId, appLoading } = state;
  const { title, content, url, domain } = data || {};
  const searchDbDebounced = useRef();

  const [creationMode, setCreationMode] = useState("QUICK");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    searchDbDebounced.current = _.debounce(searchDb, 500);
    triggerEvent("add", {
      value: `${config.CONNECTED_TO}`,
      styles: { background: colors.green },
      // expires: 3000,
    });
  }, []);

  useEffect(() => {
    if (creationMode === "SITE")
      messenger({ action: "getWebInfo" }, handleChange);
    else handleChange({ url: "", domain: "" });
  }, [creationMode]);

  const add = async () => {
    setAppLoading(true);
    try {
      if (!data.title)
        return triggerEvent("add", {
          value: `Error: Title is required`,
          styles: {
            background: colors.watermelon,
          },
          expires: 3000,
        });

      const {
        data: { result },
      } = await axios.post(`/posts?collectionId=${activeCollectionId}`, {
        data: [data],
      });
      clearFields();

      dispatch({ type: constants.ADD_TO_HISTORY, payload: result });
      triggerEvent("add", {
        value: `Success`,
        styles: {
          background: colors.green,
        },
        expires: 3000,
      });
    } catch (err) {
      console.log(err);
      triggerEvent("add", {
        value: `Error: ${err.message}`,
        styles: {
          background: colors.watermelon,
        },
        expires: 8000,
      });
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

  const options = Object.entries(_.get(state, "session.notesApp", {})).map(
    ([id, config]) => ({
      value: id,
      label: _.get(config, "name", ""),
    })
  );

  return (
    <div className="add-container">
      <div className="flex mb">
        <Radio
          options={options}
          placeholder="Collection"
          value={activeCollectionId}
          onChange={(e, activeCollectionId) =>
            dispatch({ type: "SET_KEY", payload: { activeCollectionId } })
          }
        />
      </div>

      <div className="flex mb">
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
      <div className="controls mb">
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
              autoComplete="off"
              className="input mb"
              value={url}
              name="url"
              onChange={(e, value) => handleChange(value)}
              placeholder="URL"
            />
            {creationMode === "SITE" && !!domain && (
              <Input
                className="input mb"
                value={domain}
                name="domain"
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
      <div style={{ position: "absolute", left: 0, width: "100%", bottom: 0 }}>
        <StatusBar style={{ background: "none" }} />
      </div>
    </div>
  );
};

export default AddItem;
