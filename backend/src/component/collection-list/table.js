import React from "react";
import { FRONTENDMEDIAURL, SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const Table = ({ collectionList, loading }) => {
  return (
    <>
      <table className="nft-list__table">
        <thead>
          <tr>
            <td>{__("Image", SLUG)}</td>
            <td>{__("Name", SLUG)}</td>
            <td className="creator">{__("Creator", SLUG)}</td>
            <td className="link">{__("Link", SLUG)}</td>
          </tr>
        </thead>
        <tbody>
          {collectionList.map((cur, i) => (
            <TableRow collection={cur} key={i} />
          ))}
        </tbody>
      </table>
      {loading && <h3 style={{ textAlign: "center" }}>Loading...</h3>}
    </>
  );
};

const TableRow = ({ collection }) => {
  const { term_meta, term_data, term_link } = collection;

  return (
    <tr>
      <td className="b-img">
        {term_meta?.profileImg ? (
          <img src={term_meta?.profileImg} alt={term_data.name} />
        ) : (
          <img src={`${FRONTENDMEDIAURL}demo-user.svg`} alt={term_data.name} />
        )}
      </td>
      <td>
        <p>{term_data.name}</p>
      </td>
      <td>
        <p>
          {term_meta?.creator?.substring(0, 7)}....
          {term_meta?.creator?.slice(term_meta?.creator?.length - 4)}
        </p>
      </td>
      <td>
        <a href={term_link} target="_blank">
          {__("view")}
        </a>
      </td>
    </tr>
  );
};

export default Table;
