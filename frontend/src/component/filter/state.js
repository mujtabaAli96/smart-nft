export const INISIAL_STATE = {
  searchText: "",
  priceOrder: "",
  status: "",
  priceRange: [],
  featch: false,
};

export const REDUCER = (state, action) => {
  //console.log(action, state);
  switch (action.type) {
    case "SEARCH_TEXT_CHANGE":
      return { ...state, searchText: action.payload };
    case "PRICE_ORDER_CHANGE":
      return { ...state, priceOrder: action.payload };
    case "CHANGE_STATUS":
      return { ...state, status: action.payload };
    case "CHANGE_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    default:
      return { ...state };
  }
};
