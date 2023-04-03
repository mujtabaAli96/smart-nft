import { BACKEND_AJAX_URL } from "../store";

const getCollectionMeta = async (collId) => {
  if (!collId) throw new Error("Collection id missing for vloume");

  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      action: "smartnft_get_flour_volume_of_collection",
      collId,
    },
  });
  return res;
};

const useCollectionMeta = () => {
  return {
    getCollectionMeta,
  };
};

export default useCollectionMeta;
