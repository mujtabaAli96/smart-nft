import React, { useState } from "react";
import { SLUG, FRONTENDMEDIAURL } from "../../../../common/store";
import { EditCategory } from "./edit-category";
import { CategoriesNotFound } from "./notfound";
const { __ } = wp.i18n;

const Table = ({ categoryList, loading }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [taxid, setTaxid] = useState(null);
  return (
    <>
      <EditCategory isOpen={editOpen} taxID={taxid} setOpen={setEditOpen} />
      <table className="nft-list__table">
        <thead>
          <tr>
            <td>{__("Image", SLUG)}</td>
            <td>{__("Name", SLUG)}</td>
            <td className="creator">{__("Creator", SLUG)}</td>
            <td className="link">{__("Link", SLUG)}</td>
          </tr>
        </thead>
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        <tbody>
          {categoryList.map((cur, i) => (
            <TableRow
              category={cur}
              key={i}
              setEditOpen={setEditOpen}
              setTaxid={setTaxid}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

const TableRow = ({ category, setEditOpen, setTaxid }) => {
  const { term_meta, term_data, term_link } = category;
  const openCategoryEdit = (e, taxid) => {
    e.preventDefault();
    setEditOpen(true);
    setTaxid(taxid);
  };
  return (
    <tr>
      <td className="b-img">
        {term_meta.profile_image?.[0] ? (
          <img src={term_meta.profile_image?.[0]} alt={term_data.name} />
        ) : (
          <img src={`${FRONTENDMEDIAURL}demo-user.svg`} alt={term_data.name} />
        )}
      </td>
      <td>
        <p>{term_data.name}</p>
      </td>
      <td>
        <p>
          {term_meta.creator?.[0].substring(0, 7)}....
          {term_meta.creator?.[0].slice(term_meta.creator?.length - 4)}
        </p>
      </td>
      <td>
        <a href={term_link} target="_blank">
          {__("view")}
        </a>
        <a
          href="#"
          style={{ marginLeft: 10 }}
          onClick={(e) => openCategoryEdit(e, term_data.term_id)}
        >
          {__("Edit")}
        </a>
      </td>
    </tr>
  );
};

export default Table;
