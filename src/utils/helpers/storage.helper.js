'use client';
const storageUser = 'user';
const storageLogoObject = 'auction_house_logo';
const firstLoadWillShow = 'first_load_will_show';

const storage = {
  // TODO: we use these method when we resolve reference error for window object
  getLogo: () => {
    return JSON.parse(window?.localStorage?.getItem?.(storageLogoObject));
  },
  setLogo: (logo) => {
    window?.localStorage?.setItem?.(storageLogoObject, JSON.stringify(logo));
  },

  getFirstLoadWillShow: () => {
    return JSON.parse(window?.localStorage?.getItem?.(firstLoadWillShow));
  },

  setFirstLoadWillShow: (data) => {
    window?.localStorage?.setItem?.(firstLoadWillShow, JSON.stringify(!!data));
  },

  clear: () => {
    window?.localStorage?.removeItem?.(storageUser);
  },
};
export default storage;
