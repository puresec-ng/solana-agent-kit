import { PublicKey } from "@solana/web3.js";
/**
 * Common token addresses used across the toolkit
 */
export declare const TOKENS: {
    readonly USDC: PublicKey;
    readonly USDT: PublicKey;
    readonly USDS: PublicKey;
    readonly SOL: PublicKey;
    readonly jitoSOL: PublicKey;
    readonly bSOL: PublicKey;
    readonly mSOL: PublicKey;
    readonly BONK: PublicKey;
};
/**
 * Default configuration options
 * @property {number} SLIPPAGE_BPS - Default slippage tolerance in basis points (300 = 3%)
 * @property {number} TOKEN_DECIMALS - Default number of decimals for new tokens
 */
export declare const DEFAULT_OPTIONS: {
    readonly SLIPPAGE_BPS: 300;
    readonly TOKEN_DECIMALS: 9;
};
/**
 * Jupiter API URL
 */
export declare const JUP_API = "https://quote-api.jup.ag/v6";
//# sourceMappingURL=index.d.ts.map