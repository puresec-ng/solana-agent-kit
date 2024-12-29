"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pythFetchPrice = pythFetchPrice;
const price_service_client_1 = require("@pythnetwork/price-service-client");
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Fetch the price of a given price feed from Pyth
 * @param agent SolanaAgentKit instance
 * @param priceFeedID Price feed ID
 * @returns Latest price value from feed
 *
 * You can find priceFeedIDs here: https://www.pyth.network/developers/price-feed-ids#stable
 */
async function pythFetchPrice(priceFeedID) {
    // get Hermes service URL from https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes
    const stableHermesServiceUrl = "https://hermes.pyth.network";
    const connection = new price_service_client_1.PriceServiceConnection(stableHermesServiceUrl);
    const feeds = [priceFeedID];
    try {
        const currentPrice = await connection.getLatestPriceFeeds(feeds);
        if (currentPrice === undefined) {
            throw new Error("Price data not available for the given token.");
        }
        if (currentPrice.length === 0) {
            throw new Error("Price data not available for the given token.");
        }
        // get price and exponent from price feed
        const price = new bn_js_1.default(currentPrice[0].getPriceUnchecked().price);
        const exponent = new bn_js_1.default(currentPrice[0].getPriceUnchecked().expo);
        // convert to scaled price
        const scaledPrice = price.div(new bn_js_1.default(10).pow(exponent));
        return scaledPrice.toString();
    }
    catch (error) {
        throw new Error(`Fetching price from Pyth failed: ${error.message}`);
    }
}
//# sourceMappingURL=pyth_fetch_price.js.map