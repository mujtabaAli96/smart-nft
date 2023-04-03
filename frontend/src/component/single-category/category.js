import React, { useReducer } from "react";
import Header from "./header";
import { FilterContext, REDUCER, STATE } from "./state";
import CategoryNfts from "./categoryNfts";

const SingleCategory = () => {
  const [state, dispatch] = useReducer(REDUCER, STATE);
  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      <div className="single-category">
        <Header />
        <CategoryNfts />
      </div>
    </FilterContext.Provider>
  );
};

export default SingleCategory;
