import React from "react";

export const ItemsLoader = ({ rows }) => {
  const _rows = [...Array(rows).keys()];

  return (
    <div className="stats-item-loader">
      {_rows.map((_cur, index) => (
        <Item key={index} />
      ))}
    </div>
  );
};

const Item = () => (
  <div>
    <div className="img-name">
      <span className="img loader skeleton-box"></span>
      <span className="name loader skeleton-box"></span>
    </div>

    <span className="vol loader skeleton-box"></span>
    <span className="change loader skeleton-box"></span>
    <span className="floor loader skeleton-box"></span>
    <span className="sales loader skeleton-box"></span>
    <span className="owners loader skeleton-box"></span>
    <span className="listed loader skeleton-box"></span>
  </div>
);
