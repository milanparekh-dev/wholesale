/**
 * Returns the correct price for a product vendor based on the user's membership level.
 * @param {Object} vendor - The vendor object containing price, vipStandardPrice, and vipPremiumPrice.
 * @param {string} membershipLevel - The user's membership level (standard, wholesale, premium).
 * @returns {number} The calculated price.
 */
export const getMembershipPrice = (vendor, membershipLevel) => {
    if (!vendor) return 0;

    switch (membershipLevel) {
        case "standard":
            return Number(vendor.vipStandardPrice) || Number(vendor.price) || 0;
        case "premium":
            return Number(vendor.vipPremiumPrice) || Number(vendor.price) || 0;
        case "wholesale":
        default:
            return Number(vendor.price) || 0;
    }
};
