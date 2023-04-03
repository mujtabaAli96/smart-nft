class CategoriesView {
  constructor(categories, rootEl) {
    this.categories = categories || []; //categories is an array
    this.rootEl = rootEl;
  }

  renderCategories() {
    const markup = this.categories
      .map((curEl, index) => this.renderCategory(curEl, index))
      .join(" ");

    this.clearRootEl();

    if (!this.rootEl) return;

    this.rootEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderCategory(cat, index) {
    return `<p class="nft-grid__category ${
      index == 0 ? "active" : ""
    }">${cat.replace("-", " ")}</p>`;
  }

  clearRootEl() {
    this.rootEl.innerHTML = "";
  }
}

export default CategoriesView;
