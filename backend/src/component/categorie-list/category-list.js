import React, { useState, useEffect } from "react";
import { BACKEND_AJAX_URL, NFT_PER_PAGE } from "../../../../common/store";
import Table from "./table";
import { Pagination } from "./../nft-list/pagination";
import { CategoriesNotFound } from "./notfound";
import { TableLoading } from "../../../../common/component/loading";

const CategoryList = ({ createCategory }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [curPage, setCurPage] = useState(1);

  const start = (curPage - 1) * NFT_PER_PAGE;
  const end = curPage * NFT_PER_PAGE;

  const dumyLoading = (param) => {}; //this fn does nothing

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: { action: "smartnft_get_all_categories" },
        });

        setCategoryList(res.data.categories);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="category__list">
      {loading && <TableLoading cols={4} rows={5} indeximg={true} />}
      {!loading && (
        <>
          {categoryList.length == 0 && (
            <CategoriesNotFound createCategory={createCategory} />
          )}
          {categoryList.length > 0 && (
            <Table
              categoryList={categoryList.slice(start, end)}
              loading={loading}
            />
          )}
          <Pagination
            totalNfts={categoryList.length}
            setCurPage={setCurPage}
            curPage={curPage}
            setLoading={dumyLoading}
          />
        </>
      )}
    </div>
  );
};

export default CategoryList;
