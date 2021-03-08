import React, { Fragment } from "react";
import "./Home.scss";
import AddItem from "../AddItem";
import _ from "lodash";
import {
  Button,
  Radio,
  Select,
  TextArea,
  Checkbox,
  Input,
} from "@codedrops/react-ui";

const Home = (props) => {
  const { state, dispatch } = props;
  return (
    <section>
      <AddItem {...props} />
    </section>
  );
};

export default Home;
