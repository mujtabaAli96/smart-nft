console.log("collection list page");
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CollectionList from "./component/collection-list/collection-list";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import { SLUG } from "../../common/store";
import CreateCollection from "../../frontend/src/component/create-collection/create-collection";
const { __ } = wp.i18n;

const CreateCollectionBtn = ({ setShowCreateCollections }) => {
  return (
    <button
      onClick={() => {
        setShowCreateCollections(true);
      }}
      className="sn-action-button btn-md"
    >
      {__("+ Collections", SLUG)}
    </button>
  );
};
const CollectionHeading = ({ setShowCreateCollections }) => {
  return (
    <div className="nft-list__heading">
      <h2>{__("All Collections", SLUG)}</h2>
      <CreateCollectionBtn
        setShowCreateCollections={setShowCreateCollections}
      />
    </div>
  );
};
const BackToCollectionListBtn = ({ setShowCreateCollections }) => {
  return (
    <button
      onClick={() => {
        setShowCreateCollections(false);
      }}
      className="button-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-arrow-left"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        />
      </svg>
      {__("Back to collections", SLUG)}
    </button>
  );
};

const App = () => {
  const [showCreateCollections, setShowCreateCollections] = useState(false);

  return (
    <div id="app">
      <MainErrorCapturer>
        <div className="categorys collections-page" style={{ marginTop: 40 }}>
          {showCreateCollections ? (
            <BackToCollectionListBtn
              setShowCreateCollections={setShowCreateCollections}
            />
          ) : (
            <CollectionHeading
              setShowCreateCollections={setShowCreateCollections}
            />
          )}
          {showCreateCollections ? (
            <CreateCollection redirectToSinglePage={false} />
          ) : (
            <CollectionList createCollection={setShowCreateCollections} />
          )}
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
