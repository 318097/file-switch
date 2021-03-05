const initialData = {
  content: "",
  itemType: "TODO",
  topic: "",
  marked: false,
};

export const initialState = {
  appLoading: false,
  data: {
    ...initialData,
  },
  activePage: "HOME",
  activeProjectId: null,
};

export const constants = {
  SET_LOADING: "SET_LOADING",
  CLEAR: "CLEAR",
  SET_DATA: "SET_DATA",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_SESSION: "SET_SESSION",
  SET_KEY: "SET_KEY",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        appLoading: action.payload,
      };
    case constants.CLEAR:
      return {
        ...state,
        data: { ...initialData },
        editTodo: null,
      };
    case constants.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case constants.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload,
      };
    case constants.SET_SESSION:
      const updatedSession = { ...state.session, ...action.payload };
      return {
        ...state,
        session: updatedSession,
      };
    case constants.SET_KEY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
