import React, { useState, useEffect, useContext } from "react";
import { FilterContext } from "./state";
import { BACKEND_AJAX_URL, SETTINGS, SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const NoProfile = () => <div className="category__profile-loading"></div>;
const NoBanner = () => <div className="category__banner-loading"></div>;

const Description = ({ description }) => {
  //gurd close for dashboard controll
  if (SETTINGS.categories?.single?.desc === "false") return null;

  const [desOpen, setDesOpen] = useState(false);
  const WORD_LIMIT = 160;
  const desLength = description.length;

  if (desLength > WORD_LIMIT) {
    return (
      <div>
        <p className="category__desc">
          {desOpen ? description : description.substring(0, WORD_LIMIT)}
          {desOpen ? "" : "..."}
          <span
            onClick={() => {
              setDesOpen(!desOpen);
            }}
          >
            {desOpen ? __("Show less", SLUG) : __("Show more", SLUG)}
          </span>
        </p>
      </div>
    );
  }

  return <>{description && <p className="category__desc">{description}</p>}</>;
};

const Header = () => {
  const { state, dispatch } = useContext(FilterContext);
  const [profileImg, setProfileImg] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!state.categoryId) return;
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            tax_id: state.categoryId,
            action: "smartnft_get_single_category_info",
          },
        });

        setProfileImg(res.data.meta.profile_image[0]);
        setBannerImg(res.data.meta.cover_image[0]);
        setName(res.data.data.name);
        setDescription(res.data.meta.description[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="category__header">
        {bannerImg ? (
          <img className="category__header-banner" src={bannerImg} />
        ) : (
          <NoBanner />
        )}
        {profileImg ? (
          <img className="category__header-profile" src={profileImg} />
        ) : (
          <NoProfile />
        )}
      </div>
      {name && <h1 className="category__name">{name}</h1>}
      <Description description={description} />
    </>
  );
};

export default Header;
