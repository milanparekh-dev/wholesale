/**
 * Returns the correct price for a product vendor based on the user's membership level.
 *
 * Membership level values from the API:
 *   "wholesale"    -> vendor.price
 *   "vip_standard" -> vendor.vipStandardPrice  (falls back to price)
 *   "vip_premium"  -> vendor.vipPremiumPrice   (falls back to price)
 *
 * @param {Object} vendor - The vendor object from the product (must have price / vipStandardPrice / vipPremiumPrice).
 * @param {string} membershipLevel - The buyer's membership_level from user-me API.
 * @returns {number} The resolved price for this membership tier.
 */
export const getMembershipPrice = (vendor, membershipLevel) => {
    if (!vendor) return 0;

    switch (membershipLevel) {
        case "vip_standard":
            return Number(vendor.vipStandardPrice) || Number(vendor.price) || 0;
        case "vip_premium":
            return Number(vendor.vipPremiumPrice) || Number(vendor.price) || 0;
        case "wholesale":
        default:
            return Number(vendor.price) || 0;
    }
};

/**
 * Returns the vendor price field key for a given membership level.
 * Useful when you need to store which price field was used alongside a cart item.
 *
 * @param {string} membershipLevel
 * @returns {"price"|"vipStandardPrice"|"vipPremiumPrice"}
 */
export const getPriceField = (membershipLevel) => {
    switch (membershipLevel) {
        case "vip_standard": return "vipStandardPrice";
        case "vip_premium":  return "vipPremiumPrice";
        default:             return "price";
    }
};
