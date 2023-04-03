import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import CreateCategoryComponent from "./create-category";
import CategoryList from "./component/categorie-list/category-list";
import { SLUG } from "../../common/store";
const { __ } = wp.i18n;

const CreateCategoryBtn = ({ setShowCreateCategory }) => {
  return (
    <button
      onClick={() => {
        setShowCreateCategory(true);
      }}
      className="sn-action-button btn-md"
    >
      {__("+ Category", SLUG)}
    </button>
  );
};
const CategoryHeading = ({ setShowCreateCategory }) => {
  return(
    <div className="nft-list__heading">
      <h2>{__("All Categories", SLUG)}</h2>
      <CreateCategoryBtn setShowCreateCategory={setShowCreateCategory} />
    </div>
  )
}
const BackToCategoryListBtn = ({ setShowCreateCategory }) => {
  return (
    <button
      onClick={() => {
        setShowCreateCategory(false);
      }}
      className="button-transparent"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
      {__("Back to categories", SLUG)}
    </button>
  );
};

const App = () => {
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  return (
    <div id="app">
      <MainErrorCapturer>
        <div className="categorys" style={{marginTop: 40}}>
          {showCreateCategory ? (
            <BackToCategoryListBtn
              setShowCreateCategory={setShowCreateCategory}
            />
          ) : (
            <CategoryHeading setShowCreateCategory={setShowCreateCategory} />
          )}
          {showCreateCategory ? <CreateCategoryComponent /> : <CategoryList createCategory={setShowCreateCategory} />}
        </div>
      </MainErrorCapturer>
    </div>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
