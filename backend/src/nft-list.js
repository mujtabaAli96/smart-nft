import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { NftListIndex } from "./component/nft-list/index";
import MainErrorCapturer from "../../common/component/error-comp/main-error";
import { SLUG } from "../../common/store";
const { __ } = wp.i18n;
import { CreateNftIntegratiton } from "./component/create-nft/create-nft-integrate";

const BackButton = ({ setIsFormOpen }) => {
  return (
    <span className="back" onClick={() => setIsFormOpen(false)}>
      <svg className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path
          fillRule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
        />
      </svg>
      {__("Back to list", SLUG)}
    </span>
  );
};

const App = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isFormOpen) {
    return (
      <div className="create-nft-form-parent">
        <BackButton setIsFormOpen={setIsFormOpen} />
        <CreateNftIntegratiton />
      </div>
    );
  }

  return (
    <MainErrorCapturer>
      <div id="app">
        <div>
          <NftListIndex setIsFormOpen={setIsFormOpen} />
        </div>
      </div>
    </MainErrorCapturer>
  );
};

const container = document.getElementById("smartnft-root");
const appRoot = createRoot(container);
if (container) {
  appRoot.render(<App />);
}
