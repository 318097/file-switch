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
import "./History.scss";
import config from "../../config";
import moment from "moment";

const History = ({ state, dispatch, setAppLoading }) => {
  const { history } = state;

  return (
    <section id="history">
      {history.map(({ index, title, createdAt, _id }) => {
        return (
          <div className="flex column item" key={_id}>
            <div className="flex">{`${index}. ${title}`}</div>
            <div className="flex date">{`Created: ${moment(createdAt).format(
              "DD, MMM"
            )}`}</div>
          </div>
        );
      })}
    </section>
  );
};

export default History;
