// Prices for a regular customer («مشتری عادی») who buys more try-on images for herself.
// Kept apart from worker/prices.js, which build.py generates from the salon price sheet:
// never move these into prices.js by hand, and never take an amount from the browser.
//
// amount: TOMAN on the page; orders store RIALS (×10), like every other order.
export const CUSTOMER_IMAGE_PRICE = 30000;          // toman per image, no discount on any pack
export const CUSTOMER_FREE_IMAGES = 1;              // free images on /try, per person
export const CUSTOMER_PACKS = [6, 9, 12];           // 180,000 / 270,000 / 360,000 toman
export const CUSTOMER_CUSTOM_DEFAULT = 13;          // «تعداد بیشتر می‌خواهم» starts here
export const CUSTOMER_MAX_IMAGES = 500;             // one order may not ask for more
export const customerAmount = count => count * CUSTOMER_IMAGE_PRICE;
// Referral: when a salon buys a plan through someone's link, both sides get this many images.
export const REFERRAL_IMAGES = 10;
