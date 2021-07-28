export const initialData = {
  title: "",
  content: "",
  url: "",
  domain: "",
  status: "QUICK_ADD",
};

export const initialState = {
  appLoading: false,
  data: {
    ...initialData,
  },
  activePage: "HOME",
  activeCollectionId: null,
  session: null,
  history: [],
};

export const constants = {
  SET_LOADING: "SET_LOADING",
  CLEAR: "CLEAR",
  SET_DATA: "SET_DATA",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_SESSION: "SET_SESSION",
  SET_KEY: "SET_KEY",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
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
    case constants.SET_SESSION: {
      const updatedSession = { ...state.session, ...action.payload };
      return {
        ...state,
        session: updatedSession,
      };
    }
    case constants.ADD_TO_HISTORY:
      return {
        ...state,
        history: [...action.payload, ...state.history],
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
