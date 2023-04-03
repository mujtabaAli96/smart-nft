import { BACKEND_AJAX_URL } from "../store";

const getUserCollections = async (creator) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: { action: "smartnft_get_user_collections", creator },
  });

  console.log(res);
  return res.data?.collections;
};

const updateCollection = async (collection_info) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      action: "smartnft_update_collection",
      collection_info,
    },
  });
  return res;
};

const getCollectionByCollId = async (collId) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      action: "smartnft_get_collection_by_coll_id",
      collId,
    },
  });
  return res?.data;
};

const getCollectionByPostId = async (postId) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "smartnft_get_collection_by_post_id",
        postId,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

const getCollectionByConAddress = async (conAddress) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        action: "smartnft_get_collection_by_con_address",
        conAddress,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

const getAllCollection = async () => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: { action: "get_all_collections_with_total_item" },
  });

  return res.data.collections;
};

const useCollection = () => {
  return {
    getUserCollections,
    getCollectionByConAddress,
    getCollectionByCollId,
    getCollectionByPostId,
    updateCollection,
    getAllCollection,
  };
};

export default useCollection;
