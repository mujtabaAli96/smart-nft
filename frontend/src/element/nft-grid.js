//this file is controller file
import Store from "./nft-grid/state";
import CategoriesView from "./nft-grid/categories";
import NftView from "./nft-grid/nftView";

const main = (smartnftNftGridElementSettings) => {
  let elementSettings = null;
  let store = null;
  let categoriesView = null;
  let nftView = null;

  const addListenerToCategories = () => {
    const allCatDom = document.querySelectorAll(
      `.smartnft_nft_grid_categories_${elementSettings.unique_id} .nft-grid__category`
    );

    allCatDom.forEach((cat, index) =>
      cat.addEventListener("click", (e) => {
        //deactive other tabs and active clicked tabs
        allCatDom.forEach((cur) => {
          if (cur == e.target) {
            return cur.classList.add("active");
          }
          cur.classList.remove("active");
        });

        //render nfts
        nftViewController(categoriesView.categories[index]);
      })
    );
  };

  const categoriesController = () => {
    //render categories
    categoriesView.renderCategories();

    //add listener to every categories
    addListenerToCategories();
  };

  const nftViewController = async (category) => {
    if (store.category == category || !category) return;

    try {
      //render loader
      nftView.startLoader();
      //fetch nfts
      const nfts = await store.fetchNfts(category);

      //render
      nftView.renderNfts(nfts);
    } catch (err) {
      console.log(err);
    }
  };

  elementSettings = JSON.parse(smartnftNftGridElementSettings);
  categoriesView = new CategoriesView(
    elementSettings.category_selector,
    document.querySelector(
      `.smartnft_nft_grid_categories_${elementSettings.unique_id}`
    )
  );

  nftView = new NftView(
    elementSettings,
    document.querySelector(
      `.smartnft_nft_grid_nfts_${elementSettings.unique_id}`
    )
  );

  store = new Store(elementSettings);

  //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>grid<<<<<<<<<<<<<<<<<<<");
  //console.log(local, elementSettings);

  if (elementSettings.isTabOn === "yes") categoriesController();

  const tempSlug = elementSettings.category_selector[0];
  //const slug = elementSettings.isTabOn === "yes" ? tempSlug : "all";
  nftViewController(tempSlug);
};

window.SMARTNFT_NFT_GRID_RERUN_APP = () => {
  //this fn is necessacry to work the script in builder;
  //if no need builder support then call the `main()` directly without `refTimer()` fn;

  if (typeof smartnftNftGridElementSettings !== "undefined") {
    smartnftNftGridElementSettings.forEach((cur) => {
      let INTERVAL = 300;
      let timeToMakeNextRequest = 0;
      function rafTimer(time) {
        if (timeToMakeNextRequest <= time) {
          timeToMakeNextRequest = time + INTERVAL;
          if (typeof cur !== "undefined") {
            const elementSettings = JSON.parse(cur);
            const widgets = document.querySelector(
              `.smartnft_nft_grid_categories_${elementSettings.unique_id}`
            );
            if (widgets) {
              main(cur);
              return;
            }
          }
        }
        requestAnimationFrame(rafTimer);
      }
      requestAnimationFrame(rafTimer);
    });
  }
};

window.SMARTNFT_NFT_GRID_RERUN_APP();
