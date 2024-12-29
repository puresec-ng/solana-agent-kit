import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "../index";
import { BN } from "@coral-xyz/anchor";
import { Decimal } from "decimal.js";
/**
 * Maps fee tier percentages to their corresponding tick spacing values in the Orca Whirlpool protocol.
 *
 * @remarks
 * Fee tiers determine the percentage of fees collected on swaps, while tick spacing affects
 * the granularity of price ranges for liquidity positions.
 *
 * For more details, refer to:
 * - [Whirlpool Fees](https://orca-so.github.io/whirlpools/Architecture%20Overview/Whirlpool%20Fees)
 * - [Whirlpool Parameters](https://orca-so.github.io/whirlpools/Architecture%20Overview/Whirlpool%20Parameters)
 *
 * @example
 * const tickSpacing = FEE_TIERS[0.30]; // Returns 64
 */
export declare const FEE_TIERS: {
    readonly 0.01: 1;
    readonly 0.02: 2;
    readonly 0.04: 4;
    readonly 0.05: 8;
    readonly 0.16: 16;
    readonly 0.3: 64;
    readonly 0.65: 96;
    readonly 1: 128;
    readonly 2: 256;
};
/**
 * # Creates a single-sided Whirlpool.
 *
 * This function initializes a new Whirlpool (liquidity pool) on Orca and seeds it with liquidity from a single token.
 *
 * ## Example Usage:
 * You created a new token called SHARK, and you want to set the initial price to 0.001 USDC.
 * You set `depositTokenMint` to SHARK's mint address and `otherTokenMint` to USDC's mint address.
 * You can minimize price impact for buyers in a few ways:
 * 1. Increase the amount of tokens you deposit
 * 2. Set the initial price very low
 * 3. Set the maximum price closer to the initial price
 *
 * ### Note for experts:
 * The Wrhirlpool program initializes the Whirlpool with the in a specific order. This might not be
 * the order you expect, so the function checks the order and adjusts the inverts the prices. This means that
 * on-chain the Whirlpool might be configured as USDC/SHARK instead of SHARK/USDC, and the on-chain price will
 * be 1/`initialPrice`. This will not affect the price of the token as you intended it to be.
 *
 * @param agent - The `SolanaAgentKit` instance representing the wallet and connection details.
 * @param depositTokenAmount - The amount of the deposit token (including the decimals) to contribute to the pool.
 * @param depositTokenMint - The mint address of the token being deposited into the pool, eg. SHARK.
 * @param otherTokenMint - The mint address of the other token in the pool, eg. USDC.
 * @param initialPrice - The initial price of the deposit token in terms of the other token.
 * @param maxPrice - The maximum price at which liquidity is added.
 * @param feeTier - The fee tier percentage for the pool, determining tick spacing and fee collection rates.
 *
 * @returns A promise that resolves to a transaction ID (`string`) of the transaction creating the pool.
 *
 * @throws Will throw an error if:
 * - Mint accounts for the tokens cannot be fetched.
 * - Prices are out of bounds.
 *
 * @remarks
 * This function is designed for single-sided deposits where users only contribute one type of token,
 * and the function manages mint order and necessary calculations.
 *
 * @example
 * ```typescript
 * import { SolanaAgentKit } from "your-sdk";
 * import { PublicKey } from "@solana/web3.js";
 * import { BN } from "@coral-xyz/anchor";
 * import Decimal from "decimal.js";
 *
 * const agent = new SolanaAgentKit(wallet, connection);
 * const depositAmount = new BN(1_000_000_000_000); // 1 million SHARK if SHARK has 6 decimals
 * const depositTokenMint = new PublicKey("DEPOSTI_TOKEN_ADDRESS");
 * const otherTokenMint = new PublicKey("OTHER_TOKEN_ADDRESS");
 * const initialPrice = new Decimal(0.001);
 * const maxPrice = new Decimal(5.0);
 * const feeTier = 0.30;
 *
 * const txId = await createOrcaSingleSidedWhirlpool(
 *   agent,
 *   depositAmount,
 *   depositTokenMint,
 *   otherTokenMint,
 *   initialPrice,
 *   maxPrice,
 *   feeTier,
 * );
 * console.log(`Single sided whirlpool created in transaction: ${txId}`);
 * ```
 */
export declare function createOrcaSingleSidedWhirlpool(agent: SolanaAgentKit, depositTokenAmount: BN, depositTokenMint: PublicKey, otherTokenMint: PublicKey, initialPrice: Decimal, maxPrice: Decimal, feeTier: keyof typeof FEE_TIERS): Promise<string>;
//# sourceMappingURL=create_orca_single_sided_whirlpool.d.ts.map