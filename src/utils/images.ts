export const HOTEL_IMAGES = {
  hero: `${import.meta.env.BASE_URL}images/hero_cameroon_luxury_1793714393134.jpg`,
  douala: `${import.meta.env.BASE_URL}images/room_douala_waterfront_1793714395315.jpg`,
  kribi: `${import.meta.env.BASE_URL}images/room_kribi_ocean_1793714394549.jpg`,
  limbe: `${import.meta.env.BASE_URL}images/room_limbe_bungalow_1793714396592.jpg`,
  yaounde: `${import.meta.env.BASE_URL}images/room_yaounde_palace_1793714396103.jpg`,
};

const LEGACY_IMAGE_URLS: Record<string, string> = {
  '/src/assets/images/hero_cameroon_luxury_1793714393134.jpg': HOTEL_IMAGES.hero,
  '/src/assets/images/room_douala_waterfront_1793714395315.jpg': HOTEL_IMAGES.douala,
  '/src/assets/images/room_kribi_ocean_1793714394549.jpg': HOTEL_IMAGES.kribi,
  '/src/assets/images/room_limbe_bungalow_1793714396592.jpg': HOTEL_IMAGES.limbe,
  '/src/assets/images/room_yaounde_palace_1793714396103.jpg': HOTEL_IMAGES.yaounde,
};

export function resolveHotelImageUrl(url: string): string {
  return LEGACY_IMAGE_URLS[url] ?? url;
}
