import React, { useState } from "react";
import { Icons } from "../../../../common/component/icons";
import { FRONTENDMEDIAURL, SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const Form = ({ editeProfileProvider }) => {
  const changeData = (obj) => {
    editeProfileProvider.setData((prev) => ({ ...prev, ...obj }));
    console.log(editeProfileProvider.data);
  };

  return (
    <div className="profile-form">
      <Name name={editeProfileProvider.data.name} changeData={changeData} />
      <UserName
        userName={editeProfileProvider.data.userName}
        changeData={changeData}
      />
      <ShortBio
        shortBio={editeProfileProvider.data.shortBio}
        changeData={changeData}
      />
      <Email email={editeProfileProvider.data.email} changeData={changeData} />

      <SocialLink
        profileProvider={editeProfileProvider}
        changeData={changeData}
      />
      <SaveButton save={editeProfileProvider.saveProfile} />
    </div>
  );
};

const Name = ({ changeData, name }) => {
  return (
    <label htmlFor="name">
      <p>{__("Display name", SLUG)}</p>
      <input
        type="text"
        id="name"
        placeholder={__("Enter your display name", SLUG)}
        value={name}
        onChange={(e) => {
          changeData({ name: e.target.value });
        }}
      />
    </label>
  );
};

const UserName = ({ userName, changeData }) => {
  return (
    <label htmlFor="user-name">
      <p>{__("Username", SLUG)}</p>
      <input
        type="text"
        id="user-name"
        placeholder={__("Enter your username", SLUG)}
        value={userName}
        onChange={(e) => {
          changeData({ userName: e.target.value });
        }}
      />
    </label>
  );
};

const ShortBio = ({ shortBio, changeData }) => {
  return (
    <label htmlFor="short-bio">
      <p>{__("Short bio", SLUG)}</p>
      <textarea
        placeholder={__("Tell about yourself in a few words", SLUG)}
        id="short-bio"
        name="short-bio"
        cols="30"
        rows="10"
        value={shortBio}
        onChange={(e) => {
          changeData({ shortBio: e.target.value });
        }}
      ></textarea>
    </label>
  );
};

const Email = ({ email, changeData }) => {
  return (
    <label htmlFor="email">
      <p>{__("Email", SLUG)}</p>
      <span>{__("Your email for marketplace notifications", SLUG)}</span>
      <input
        type="email"
        di="email"
        placeholder={__("Enter your email", SLUG)}
        value={email}
        onChange={(e) => {
          changeData({ email: e.target.value });
        }}
      />
    </label>
  );
};

const SocialLink = ({ profileProvider, changeData }) => {
  const socialprofiles = profileProvider.data.socialProfiles
  const [morelinks, setMoreLinks] = useState(false)
  const updateSocialProfile = ( newfields ) =>{
    profileProvider.setData( prev => (
      {
        ...prev, 
        socialProfiles : newfields
      }
    ) )
  }
  const changeSocials = ( key, value, index ) =>{
    socialprofiles[index][key] = value
    updateSocialProfile(socialprofiles)
  }
  const removeField = ( index ) =>{
    socialprofiles.splice(index, 1)
    updateSocialProfile(socialprofiles)
  }
  const addlink = (name) => {
    const newProfileFields = [...socialprofiles, {
      name: name,
      url: ''
    }]
    // addSocialProfile(newProfileFields)
    updateSocialProfile(newProfileFields)
  }
  const platforms = [
    {
      'name' : __("website", SLUG),
    },
    {
      'name' : __("facebook", SLUG),
    },
    {
      'name' : __("twitter", SLUG),
    },
    {
      'name' : __("linkedin", SLUG),
    },
    {
      'name' : __("youtube", SLUG),
    },
    {
      'name' : __("tiktok", SLUG),
    },
    {
      'name' : __("discord", SLUG),
    },
    {
      'name' : __("telegram", SLUG),
    },
    {
      'name' : __("reddit", SLUG),
    },
    {
      'name' : __("instagram", SLUG),
    },
    {
      'name' : __("tumblr", SLUG),
    },
    {
      'name' : __("vk", SLUG),
    },
    {
      'name' : __("snapchat", SLUG),
    }
  ]
  
  return (
    <label htmlFor="social-link">
      <p>{__("Your links", SLUG)}</p>
      <span>
        {__("Add your existing links to build a stronger reputation", SLUG)}
      </span>
      <div className="profile-socials">
        {
            socialprofiles &&
            socialprofiles.map( (elem, i ) => (
                <div className="profile-socials__input-group" key={i}>
                  <span className="profile-socials__input-group__icon">{Icons[elem.name]}</span>
                  <input 
                    type="text" 
                    value={elem.url} 
                    onChange={ e => changeSocials( 'url', e.target.value, i)} 
                    placeholder={__(`Enter your ${elem.name} link`, SLUG) }
                  />
                  <span className="profile-socials__input-group__delete" onClick={e => removeField(i)}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4H2.5H14.5" stroke="#A7A7A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13 4V14.5C13 14.8978 12.842 15.2794 12.5607 15.5607C12.2794 15.842 11.8978 16 11.5 16H4C3.60218 16 3.22064 15.842 2.93934 15.5607C2.65804 15.2794 2.5 14.8978 2.5 14.5V4M4.75 4V2.5C4.75 2.10218 4.90804 1.72064 5.18934 1.43934C5.47064 1.15804 5.85218 1 6.25 1H9.25C9.64782 1 10.0294 1.15804 10.3107 1.43934C10.592 1.72064 10.75 2.10218 10.75 2.5V4" stroke="#A7A7A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.25 7.75V12.25" stroke="#A7A7A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.25 7.75V12.25" stroke="#A7A7A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>            
            ) )
        }
        <span className="add-new-field" onClick={e => setMoreLinks(!morelinks)}>+ {__("Add new field", SLUG)}</span>
        {
          morelinks &&
          <div className="add-more-profiles">
            <ul style={{padding: 0}}>
              {
                platforms.map( (elem, index) => (
                  <li key={index} onClick={ e => addlink(elem.name) }>
                    <span className="add-more-profiles__icon">
                      {Icons[elem.name]}
                    </span>
                    <span>{elem.name}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        }
      </div>
    </label>
  );
};

const SaveButton = ({ save }) => {
  return (
    <button className="profile-form__save-btn" onClick={save}>
      {__("Save settings", SLUG)}
    </button>
  );
};

export { Form };
