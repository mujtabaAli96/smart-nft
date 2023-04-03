import React, { useState, useEffect } from "react";
import Table from "./table";
import { CollectionNotFound } from "./notfound";
import { TableLoading } from "../../../../common/component/loading";
import useCollection from "../../../../common/hook/useCollection.hook";

const CollectionList = ({ createCollection }) => {
  const [collectionList, setCollectionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllCollection } = useCollection();

  async function fetchData() {
    try {
      const res = await getAllCollection();
      setCollectionList(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="collection__list">
      {loading && <TableLoading cols={4} rows={3} indeximg={true} />}
      {!loading && (
        <>
          {collectionList.length == 0 && (
            <CollectionNotFound createCollection={createCollection} />
          )}
          {collectionList.length > 0 && (
            <>
              <Table collectionList={collectionList} loading={loading} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CollectionList;
