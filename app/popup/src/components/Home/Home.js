import React, { Fragment } from "react";
import "./Home.scss";
import AddItem from "../AddItem";

const Home = (props) => {
  return (
    <section>
      <AddItem {...props} />
    </section>
  );
};

export default Home;
