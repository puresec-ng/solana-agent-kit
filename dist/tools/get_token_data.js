"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenDataByAddress = getTokenDataByAddress;
exports.getTokenAddressFromTicker = getTokenAddressFromTicker;
exports.getTokenDataByTicker = getTokenDataByTicker;
const web3_js_1 = require("@solana/web3.js");
async function getTokenDataByAddress(mint) {
    try {
        if (!mint) {
            throw new Error("Mint address is required");
        }
        const response = await fetch("https://tokens.jup.ag/tokens?tags=verified", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = (await response.json());
        const token = data.find((token) => {
            return token.address === mint.toBase58();
        });
        return token;
    }
    catch (error) {
        throw new Error(`Error fetching token data: ${error.message}`);
    }
}
async function getTokenAddressFromTicker(ticker) {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${ticker}`);
        const data = await response.json();
        if (!data.pairs || data.pairs.length === 0) {
            return null;
        }
        // Filter for Solana pairs only and sort by FDV
        let solanaPairs = data.pairs
            .filter((pair) => pair.chainId === "solana")
            .sort((a, b) => (b.fdv || 0) - (a.fdv || 0));
        solanaPairs = solanaPairs.filter((pair) => pair.baseToken.symbol.toLowerCase() === ticker.toLowerCase());
        // Return the address of the highest FDV Solana pair
        return solanaPairs[0].baseToken.address;
    }
    catch (error) {
        console.error("Error fetching token address from DexScreener:", error);
        return null;
    }
}
async function getTokenDataByTicker(ticker) {
    const address = await getTokenAddressFromTicker(ticker);
    if (!address) {
        throw new Error(`Token address not found for ticker: ${ticker}`);
    }
    return getTokenDataByAddress(new web3_js_1.PublicKey(address));
}
//# sourceMappingURL=get_token_data.js.map