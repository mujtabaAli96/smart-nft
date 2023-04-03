import { BACKEND_AJAX_URL } from "../store";

const getCategories = async () => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: { action: "smartnft_get_all_categories_name_only" },
  });

  console.log(res);

  return res.data.categories;
};

const getCategoryByPostId = async (id) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        id,
        action: "get_category_info",
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const useCategories = () => {
  return {
    getCategories,
    getCategoryByPostId,
  };
};

export default useCategories;
