const cocktail = {
  homeUrl: 'https://cocktailclub.com/cocktails',
  popUp: true,
  has_loadMore_Btn: true,
  is_infinity_scroll: true,
  name_selector: 'h4',
  type_selector: 'p',
  img_selector: 'img',
  url_selector: 'a',
  popup_selector: 'rcc-confirm-button',
  pageItemSize: 24,
  load_selector: {
    css:
      '#__next > div.Home.Home_Home__r7pEu > main > section:nth-child(2) > div > button',
  },
  item_selector:
    '#__next > div.Home.Home_Home__r7pEu > main > section:nth-child(2) > div > div.GalleryFeed > div > a',
  description_selector:
    '#__next > div.Home.Home_Home__Jnie5.Cocktail.Cocktail_Cocktail__7DH6O > main > article > section.Section.Cocktail_cocktailInfoSection__ev0_G.b-greige.p0 > div > div > div:nth-child(1) > p > p:nth-child(1)',
  taste_selector:
    '#__next > div.Home.Home_Home__Jnie5.Cocktail.Cocktail_Cocktail__7DH6O > main > article > section.Section.Cocktail_cocktailInfoSection__ev0_G.b-greige.p0 > div > div > div:nth-child(2) > div.Cocktail_TasteProfile__N2jGf',
}

module.exports = cocktail
