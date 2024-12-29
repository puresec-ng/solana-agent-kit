"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JUP_API = exports.DEFAULT_OPTIONS = exports.TOKENS = void 0;
const web3_js_1 = require("@solana/web3.js");
/**
 * Common token addresses used across the toolkit
 */
exports.TOKENS = {
    USDC: new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    USDT: new web3_js_1.PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    USDS: new web3_js_1.PublicKey("USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"),
    SOL: new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"),
    jitoSOL: new web3_js_1.PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
    bSOL: new web3_js_1.PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
    mSOL: new web3_js_1.PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
    BONK: new web3_js_1.PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
};
/**
 * Default configuration options
 * @property {number} SLIPPAGE_BPS - Default slippage tolerance in basis points (300 = 3%)
 * @property {number} TOKEN_DECIMALS - Default number of decimals for new tokens
 */
exports.DEFAULT_OPTIONS = {
    SLIPPAGE_BPS: 300,
    TOKEN_DECIMALS: 9,
};
/**
 * Jupiter API URL
 */
exports.JUP_API = "https://quote-api.jup.ag/v6";
//# sourceMappingURL=index.js.map