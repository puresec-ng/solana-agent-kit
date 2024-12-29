/**
 * Fetch the price of a given price feed from Pyth
 * @param agent SolanaAgentKit instance
 * @param priceFeedID Price feed ID
 * @returns Latest price value from feed
 *
 * You can find priceFeedIDs here: https://www.pyth.network/developers/price-feed-ids#stable
 */
export declare function pythFetchPrice(priceFeedID: string): Promise<string>;
//# sourceMappingURL=pyth_fetch_price.d.ts.map