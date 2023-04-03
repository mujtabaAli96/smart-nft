class Store {
  constructor(settings) {
    this.settings = settings;
    this.category = null;
    this.nfts = [];
    this.limit = settings.limit;
  }

  async fetchNfts(slug) {
    if (this.category === slug || !slug) return this.nfts;

    try {
      const res = await jQuery.ajax({
        type: "post",
        url: nft_grid_local.BACKEND_AJAX_URL, //nft_grid_local is localization variable
        data: {
          limit: this.limit || 12,
          cat_slug: slug,
          contract_addr: nft_grid_local.ACTIVE_CONTRACT?.address || "",
          action: "smartnft_get_nft_by_category",
        },
      });

      this.category = slug; //set slug so next time slug is same dont fetch again
      this.nfts = res.data.nfts;

      return this.nfts;
    } catch (err) {
      console.log(err);
    }
  }
}

export default Store;
