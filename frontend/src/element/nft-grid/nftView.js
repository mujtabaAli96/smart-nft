const { __ } = wp.i18n;
const SLUG = "smartnft";

class NftView {
  constructor(settings, rootEl) {
    this.settings = settings;
    this.rootEl = rootEl;
    this.limit = settings.limit || 12;
  }

  startLoader() {
    const singleLoader = `
        <div class="all-nft-skeleton__col" >
          <div class="all-nft-skeleton__inner">
            <div class="all-nft-skeleton__image-con">
              <span class="skeleton-box all-nft-skeleton__image"></span>
            </div>
            <div class="all-nft-skeleton__contents">
              <span class="skeleton-box all-nft-skeleton__name"></span>
              <span class="skeleton-box all-nft-skeleton__price-label"></span>
              <span class="skeleton-box all-nft-skeleton__price"></span>
            </div>
          </div>
        </div>`;

    const markup = [...Array(this.limit)].map((cur) => singleLoader).join(" ");

    this.clearRootEl();

    if (!this.rootEl) return;

    this.rootEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderNfts(nfts) {
    console.log(nfts)
    if (!nfts.length) {
      //before render clearRootEl
      this.clearRootEl();
      this.rootEl.insertAdjacentHTML("afterbegin", this.notFound());
      return;
    }

    const markup = nfts.map((nft) => this.renderNft(nft)).join(" ");
    //before render clearRootEl
    this.clearRootEl();
    //render
    this.rootEl.insertAdjacentHTML("afterbegin", markup);

    this.addMouseHoverVideoPlayListener();
  }

  addMouseHoverVideoPlayListener() {
    const videos = this.rootEl.querySelectorAll(".video-preview video");
    videos.forEach((video) => {
      video.addEventListener("mouseenter", (e) => e.target.play());
      video.addEventListener("mouseleave", (e) => e.target.pause());
    });
  }

  notFound() {
    return `
      <div class="nonft-found">
        <h3> ${__("No NFTS Found", SLUG)}</h3>
        <p>${__("No nfts has been found here.", SLUG)}</p>
      </div>`;
  }

  videoMarkup(data) {
    return `
          <div class="video-preview">
            <video
              class="card__img"
              src=${data?.mediaUrl}
              alt=${data?.meta?.name}
            />
            <span class="video-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-play-fill"
                viewBox="0 0 16 16"
              >
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
            </span>
          </div>`;
  }

  audioMarkup(data) {
    const mediaSrc = data?.thumbnailMediaUrl?.attach_url;
    return `
        <div class="audio-preview">
          <span class="form-preview-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-music-note"
              viewBox="0 0 16 16"
            >
              <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
              <path fillRule="evenodd" d="M9 3v10H8V3h1z" />
              <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
            </svg>
          </span>
          ${mediaSrc && `<img src=${mediaSrc} />`}
        </div>`;
  }

  imgMarkup(data) {
    return `<img class="card__img" src=${data?.thumbnailMediaUrl?.attach_url} alt=${data.meta?.name} />`;
  }

  userNameMarkup(data) {
    if (data.creator_name) {
      return `<p class=" meta-font card__creator">${data.creator_name}</p>`;
    }
    return `
      <p class="meta-font card__creator">
        ${data.creator?.substring(0, 7)}....
        ${data.creator?.substring(data.creator.length - 4)}
      </p>`;
  }

  listedMarkup(data) {
    if (data.isListed == "true") {
      return `
      <p class="header-three card__price">
            ${data.price} ${data?.selectedContract?.network.currencySymbol}
      </p>`;
    }

    return `
        <p class="header-three card__price">
          ${__("Not for sale", SLUG)}
        </p>`;
  }

  nftNameMarkup(data) {
    return `
        <p class="header-three card__name">
          ${
            data.meta?.name.split(" ").length > 4
              ? `${data.meta?.name?.split(" ")?.splice(0, 4)?.join(" ")}....`
              : data?.meta?.name
          }
        </p>`;
  }

  renderNft(data) {
    const singleCard = `
    <div class="card">
      <figure>
        <a href=${data.permalink}>
		  ${data.fileType.startsWith("video") ? this.videoMarkup(data) : ""}
          ${data.fileType.startsWith("audio") ? this.audioMarkup(data) : ""}
          ${data.fileType.startsWith("image") ? this.imgMarkup(data) : ""}
        </a>
      </figure>
      <a href=${data.permalink}>
        <div class="card__info">
          ${this.userNameMarkup(data)}
          ${this.nftNameMarkup(data)}
          <span class="meta-font">${__("Price", SLUG)}</span>
          ${this.listedMarkup(data)}
        </div>
      </a>
    </div>
    `;

    return singleCard;
  }

  clearRootEl() {
    this.rootEl.innerHTML = "";
  }
}

export default NftView;
