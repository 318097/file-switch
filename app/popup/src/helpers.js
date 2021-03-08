import moment from "moment";
import config from "./config";

const formatDate = (date) => moment(date).format("DD MMM, YY");

const formatData = ({ topics, todos, today, pendingTasksOnly }) => {
  const now = moment();
  if (today)
    todos = todos.filter(
      (todo) =>
        todo.marked &&
        todo.completedOn &&
        moment(todo.completedOn).isSame(now, "day")
    );
  let hasData = false;

  const result = topics
    .filter((topic) => topic.visible)
    .map((topic) => {
      let doneCount = 0;
      const filteredTodos = todos.filter((todo) => {
        if (todo.topicId !== topic._id) return false;
        if (pendingTasksOnly && !today && todo.marked) return false;
        if (todo.marked) doneCount++;
        return true;
      });
      if (filteredTodos.length) hasData = true;
      return {
        ...topic,
        todos: filteredTodos,
        doneCount,
      };
    });
  return today && !hasData ? [] : result;
};

export { formatData, formatDate };
