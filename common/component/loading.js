import React from "react";

export const BuyComponentLoading = () => {
  return (
    <div className="buy-component-skeleton">
      <div className="buy-component-skeleton__inner">
        <span className="skeleton-box single-nft-skeleton__price-label"></span>
        <span className="skeleton-box single-nft-skeleton__price"></span>
      </div>
    </div>
  );
};

export const AllNftLoader = ({ pageClass, perPageItems }) => {
  const blockItems = document.documentElement.clientWidth <= 700 ? parseInt(perPageItems) % 2 == 0 ? perPageItems : (parseInt(perPageItems) + 1) : perPageItems

  return (
    <div className={`${pageClass} all-nft-skeleton`}>
      {[...Array(blockItems)].map((cur, i) => (
        <div className="all-nft-skeleton__col" key={i}>
          <div className="all-nft-skeleton__inner">
            <div className="all-nft-skeleton__image-con">
              <span className="skeleton-box all-nft-skeleton__image"></span>
            </div>
            <div className="all-nft-skeleton__contents">
              <span className="skeleton-box all-nft-skeleton__name"></span>
              <span className="skeleton-box all-nft-skeleton__price-label"></span>
              <span className="skeleton-box all-nft-skeleton__price"></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CollectionsLoader = ({ perPageItems, styler }) => {
  const blockItems = document.documentElement.clientWidth <= 700 ? parseInt(perPageItems) % 2 == 0 ? perPageItems : (parseInt(perPageItems) + 1) : perPageItems
  return (
    <div className={`all-collections-${styler == 'list' ? 'list-' : ''}skeleton`}>
      { styler != 'list' && [...Array(blockItems)].map((cur, i) => (
        <div className="all-collections-skeleton__col" key={i}>
          <div className="all-collections-skeleton__inner">
            <div className="all-collections-skeleton__image-con">
              <span className="skeleton-box all-collections-skeleton__image"></span>
            </div>
            <div className="all-collections-skeleton__contents">
              <div className="all-collections-skeleton__head">
                <span className="skeleton-box all-collections-skeleton__dp"></span>
                <span className="skeleton-box all-collections-skeleton__name"></span>
              </div>
              <div className="all-collections-skeleton__info">
                <div>
                  <span className="skeleton-box all-collections-skeleton__info__price-label"></span>
                </div>
                <div>
                  <span className="skeleton-box all-collections-skeleton__info__price-label"></span>
                </div>
                <div>
                  <span className="skeleton-box all-collections-skeleton__info__price-label"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      { styler == 'list' && [...Array(blockItems)].map((cur, i) => (
        <div className="all-collections-list-skeleton__col" key={i}>
          <div className="all-collections-list-skeleton__inner">
              <div className="all-collections-list-skeleton__head">
                <span className="skeleton-box all-collections-list-skeleton__number"></span>
                <span className="skeleton-box all-collections-list-skeleton__dp"></span>
                <span className="skeleton-box all-collections-list-skeleton__name"></span>
              </div>
              <div className="all-collections-list-skeleton__info">
                <span className="skeleton-box"></span>
              </div>
              <div className="all-collections-list-skeleton__info">
                <span className="skeleton-box"></span>
              </div>
              <div className="all-collections-list-skeleton__info">
                <span className="skeleton-box"></span>
              </div>
              <div className="all-collections-list-skeleton__info">
                <span className="skeleton-box"></span>
              </div>
              <div className="all-collections-list-skeleton__info">
                <span className="skeleton-box"></span>
              </div>
          </div>
        </div>
      ))}

    </div>
  );
};

export const CollectionHeaderLoader = () => {
  return (
    <div className="collection-header-skeleton">
      <span className="skeleton-box img-skeleton h-400p border-round"></span>
      <span className="skeleton-box skeleton-deep img-skeleton h-150p w-150p overlap-left border-round"></span>
      <div className="collection-header-skeleton__contents">
        <div>
          <span className="skeleton-box w-title h-40p border-round mb-40px"></span>
          <span className="skeleton-box w-30 mb-30px border-round"></span>
          <span className="skeleton-box w-80 mb-15px border-round"></span>
          {/* <span className="skeleton-box w-60 mb-15px border-round"></span> */}
          <span className="skeleton-box w-40 mb-40px border-round"></span>
          {/* Stats sections skeleton */}
          <div className="skeleton-grid-four">
            <div>
              <span className="skeleton-box w-90p h-30p mb-15px border-round"></span>
              <span className="skeleton-box w-50p mb-15px border-round"></span>
            </div>
            <div>
              <span className="skeleton-box w-90p h-30p mb-15px border-round"></span>
              <span className="skeleton-box w-50p mb-15px border-round"></span>
            </div>
            <div>
              <span className="skeleton-box w-90p h-30p mb-15px border-round"></span>
              <span className="skeleton-box w-50p mb-15px border-round"></span>
            </div>
            <div>
              <span className="skeleton-box w-90p h-30p mb-15px border-round"></span>
              <span className="skeleton-box w-50p mb-15px border-round"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableLoading = ({ rows, cols, indeximg }) => {
  return (
    <div className="table-loading-container">
      <table>
        <thead>
          <tr>
            {[...Array(cols)].map((elem, i) => (
              <td key={i}>
                <span className="skeleton-box w-50p"></span>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((elem, i) => (
            <tr key={i}>
              {[...Array(cols)].map((elem, i) => (
                <td key={i}>
                  <span
                    className={`skeleton-box ${
                      i == 0 && indeximg ? "w-40p h-40p border-circle" : "w-50"
                    }`}
                  ></span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
