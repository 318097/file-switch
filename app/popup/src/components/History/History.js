import React from "react";
import "./History.scss";
import moment from "moment";

const History = ({ state }) => {
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
