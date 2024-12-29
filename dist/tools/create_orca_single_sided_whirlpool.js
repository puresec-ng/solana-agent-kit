"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEE_TIERS = void 0;
exports.createOrcaSingleSidedWhirlpool = createOrcaSingleSidedWhirlpool;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const decimal_js_1 = require("decimal.js");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const common_sdk_1 = require("@orca-so/common-sdk");
const instructions_1 = require("@orca-so/whirlpools-sdk/dist/instructions");
const spl_token_1 = require("@solana/spl-token");
const send_tx_1 = require("../utils/send_tx");
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
exports.FEE_TIERS = {
    0.01: 1,
    0.02: 2,
    0.04: 4,
    0.05: 8,
    0.16: 16,
    0.3: 64,
    0.65: 96,
    1.0: 128,
    2.0: 256,
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
async function createOrcaSingleSidedWhirlpool(agent, depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier) {
    const wallet = new anchor_1.Wallet(agent.wallet);
    const ctx = whirlpools_sdk_1.WhirlpoolContext.from(agent.connection, wallet, whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID);
    const fetcher = ctx.fetcher;
    const correctTokenOrder = whirlpools_sdk_1.PoolUtil.orderMints(otherTokenMint, depositTokenMint).map((addr) => addr.toString());
    const isCorrectMintOrder = correctTokenOrder[0] === depositTokenMint.toString();
    let mintA, mintB;
    if (isCorrectMintOrder) {
        [mintA, mintB] = [depositTokenMint, otherTokenMint];
    }
    else {
        [mintA, mintB] = [otherTokenMint, depositTokenMint];
        initialPrice = new decimal_js_1.Decimal(1 / initialPrice.toNumber());
        maxPrice = new decimal_js_1.Decimal(1 / maxPrice.toNumber());
    }
    const mintAAccount = await fetcher.getMintInfo(mintA);
    const mintBAccount = await fetcher.getMintInfo(mintB);
    if (mintAAccount === null || mintBAccount === null) {
        throw Error("Mint account not found");
    }
    const tickSpacing = exports.FEE_TIERS[feeTier];
    const tickIndex = whirlpools_sdk_1.PriceMath.priceToTickIndex(initialPrice, mintAAccount.decimals, mintBAccount.decimals);
    const initialTick = whirlpools_sdk_1.TickUtil.getInitializableTickIndex(tickIndex, tickSpacing);
    const tokenExtensionCtx = {
        ...whirlpools_sdk_1.NO_TOKEN_EXTENSION_CONTEXT,
        tokenMintWithProgramA: mintAAccount,
        tokenMintWithProgramB: mintBAccount,
    };
    const feeTierKey = whirlpools_sdk_1.PDAUtil.getFeeTier(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, whirlpools_sdk_1.ORCA_WHIRLPOOLS_CONFIG, tickSpacing).publicKey;
    const initSqrtPrice = whirlpools_sdk_1.PriceMath.tickIndexToSqrtPriceX64(initialTick);
    const tokenVaultAKeypair = web3_js_1.Keypair.generate();
    const tokenVaultBKeypair = web3_js_1.Keypair.generate();
    const whirlpoolPda = whirlpools_sdk_1.PDAUtil.getWhirlpool(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, whirlpools_sdk_1.ORCA_WHIRLPOOLS_CONFIG, mintA, mintB, exports.FEE_TIERS[feeTier]);
    const tokenBadgeA = whirlpools_sdk_1.PDAUtil.getTokenBadge(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, whirlpools_sdk_1.ORCA_WHIRLPOOLS_CONFIG, mintA).publicKey;
    const tokenBadgeB = whirlpools_sdk_1.PDAUtil.getTokenBadge(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, whirlpools_sdk_1.ORCA_WHIRLPOOLS_CONFIG, mintB).publicKey;
    const baseParamsPool = {
        initSqrtPrice,
        whirlpoolsConfig: whirlpools_sdk_1.ORCA_WHIRLPOOLS_CONFIG,
        whirlpoolPda,
        tokenMintA: mintA,
        tokenMintB: mintB,
        tokenVaultAKeypair,
        tokenVaultBKeypair,
        feeTierKey,
        tickSpacing: tickSpacing,
        funder: wallet.publicKey,
    };
    const initPoolIx = !whirlpools_sdk_1.TokenExtensionUtil.isV2IxRequiredPool(tokenExtensionCtx)
        ? whirlpools_sdk_1.WhirlpoolIx.initializePoolIx(ctx.program, baseParamsPool)
        : whirlpools_sdk_1.WhirlpoolIx.initializePoolV2Ix(ctx.program, {
            ...baseParamsPool,
            tokenProgramA: tokenExtensionCtx.tokenMintWithProgramA.tokenProgram,
            tokenProgramB: tokenExtensionCtx.tokenMintWithProgramB.tokenProgram,
            tokenBadgeA,
            tokenBadgeB,
        });
    const initialTickArrayStartTick = whirlpools_sdk_1.TickUtil.getStartTickIndex(initialTick, tickSpacing);
    const initialTickArrayPda = whirlpools_sdk_1.PDAUtil.getTickArray(ctx.program.programId, whirlpoolPda.publicKey, initialTickArrayStartTick);
    const txBuilder = new common_sdk_1.TransactionBuilder(ctx.provider.connection, ctx.provider.wallet, ctx.txBuilderOpts);
    txBuilder.addInstruction(initPoolIx);
    txBuilder.addInstruction((0, instructions_1.initTickArrayIx)(ctx.program, {
        startTick: initialTickArrayStartTick,
        tickArrayPda: initialTickArrayPda,
        whirlpool: whirlpoolPda.publicKey,
        funder: wallet.publicKey,
    }));
    let tickLowerIndex, tickUpperIndex;
    if (isCorrectMintOrder) {
        tickLowerIndex = initialTick;
        tickUpperIndex = whirlpools_sdk_1.PriceMath.priceToTickIndex(maxPrice, mintAAccount.decimals, mintBAccount.decimals);
    }
    else {
        tickLowerIndex = whirlpools_sdk_1.PriceMath.priceToTickIndex(maxPrice, mintAAccount.decimals, mintBAccount.decimals);
        tickUpperIndex = initialTick;
    }
    const tickLowerInitializableIndex = whirlpools_sdk_1.TickUtil.getInitializableTickIndex(tickLowerIndex, tickSpacing);
    const tickUpperInitializableIndex = whirlpools_sdk_1.TickUtil.getInitializableTickIndex(tickUpperIndex, tickSpacing);
    if (!whirlpools_sdk_1.TickUtil.checkTickInBounds(tickLowerInitializableIndex) ||
        !whirlpools_sdk_1.TickUtil.checkTickInBounds(tickUpperInitializableIndex)) {
        throw Error("Prices out of bounds");
    }
    const increasLiquidityQuoteParam = {
        inputTokenAmount: new anchor_1.BN(depositTokenAmount),
        inputTokenMint: depositTokenMint,
        tokenMintA: mintA,
        tokenMintB: mintB,
        tickCurrentIndex: initialTick,
        sqrtPrice: initSqrtPrice,
        tickLowerIndex: tickLowerInitializableIndex,
        tickUpperIndex: tickUpperInitializableIndex,
        tokenExtensionCtx: tokenExtensionCtx,
        slippageTolerance: common_sdk_1.Percentage.fromFraction(0, 100),
    };
    const liquidityInput = (0, whirlpools_sdk_1.increaseLiquidityQuoteByInputTokenWithParams)(increasLiquidityQuoteParam);
    const { liquidityAmount: liquidity, tokenMaxA, tokenMaxB } = liquidityInput;
    const positionMintKeypair = web3_js_1.Keypair.generate();
    const positionMintPubkey = positionMintKeypair.publicKey;
    const positionPda = whirlpools_sdk_1.PDAUtil.getPosition(whirlpools_sdk_1.ORCA_WHIRLPOOL_PROGRAM_ID, positionMintPubkey);
    const positionTokenAccountAddress = (0, spl_token_1.getAssociatedTokenAddressSync)(positionMintPubkey, wallet.publicKey, ctx.accountResolverOpts.allowPDAOwnerAddress, spl_token_1.TOKEN_2022_PROGRAM_ID);
    const params = {
        funder: wallet.publicKey,
        owner: wallet.publicKey,
        positionPda,
        positionTokenAccount: positionTokenAccountAddress,
        whirlpool: whirlpoolPda.publicKey,
        tickLowerIndex: tickLowerInitializableIndex,
        tickUpperIndex: tickUpperInitializableIndex,
    };
    const positionIx = (0, instructions_1.openPositionWithTokenExtensionsIx)(ctx.program, {
        ...params,
        positionMint: positionMintPubkey,
        withTokenMetadataExtension: true,
    });
    txBuilder.addInstruction(positionIx);
    txBuilder.addSigner(positionMintKeypair);
    const [ataA, ataB] = await (0, common_sdk_1.resolveOrCreateATAs)(ctx.connection, wallet.publicKey, [
        { tokenMint: mintA, wrappedSolAmountIn: tokenMaxA },
        { tokenMint: mintB, wrappedSolAmountIn: tokenMaxB },
    ], () => ctx.fetcher.getAccountRentExempt(), wallet.publicKey, undefined, ctx.accountResolverOpts.allowPDAOwnerAddress, ctx.accountResolverOpts.createWrappedSolAccountMethod);
    const { address: tokenOwnerAccountA, ...tokenOwnerAccountAIx } = ataA;
    const { address: tokenOwnerAccountB, ...tokenOwnerAccountBIx } = ataB;
    txBuilder.addInstruction(tokenOwnerAccountAIx);
    txBuilder.addInstruction(tokenOwnerAccountBIx);
    const tickArrayLowerStartIndex = whirlpools_sdk_1.TickUtil.getStartTickIndex(tickLowerInitializableIndex, tickSpacing);
    const tickArrayUpperStartIndex = whirlpools_sdk_1.TickUtil.getStartTickIndex(tickUpperInitializableIndex, tickSpacing);
    const tickArrayLowerPda = whirlpools_sdk_1.PDAUtil.getTickArray(ctx.program.programId, whirlpoolPda.publicKey, tickArrayLowerStartIndex);
    const tickArrayUpperPda = whirlpools_sdk_1.PDAUtil.getTickArray(ctx.program.programId, whirlpoolPda.publicKey, tickArrayUpperStartIndex);
    if (tickArrayUpperStartIndex !== tickArrayLowerStartIndex) {
        if (isCorrectMintOrder) {
            txBuilder.addInstruction((0, instructions_1.initTickArrayIx)(ctx.program, {
                startTick: tickArrayUpperStartIndex,
                tickArrayPda: tickArrayUpperPda,
                whirlpool: whirlpoolPda.publicKey,
                funder: wallet.publicKey,
            }));
        }
        else {
            txBuilder.addInstruction((0, instructions_1.initTickArrayIx)(ctx.program, {
                startTick: tickArrayLowerStartIndex,
                tickArrayPda: tickArrayLowerPda,
                whirlpool: whirlpoolPda.publicKey,
                funder: wallet.publicKey,
            }));
        }
    }
    const baseParamsLiquidity = {
        liquidityAmount: liquidity,
        tokenMaxA,
        tokenMaxB,
        whirlpool: whirlpoolPda.publicKey,
        positionAuthority: wallet.publicKey,
        position: positionPda.publicKey,
        positionTokenAccount: positionTokenAccountAddress,
        tokenOwnerAccountA,
        tokenOwnerAccountB,
        tokenVaultA: tokenVaultAKeypair.publicKey,
        tokenVaultB: tokenVaultBKeypair.publicKey,
        tickArrayLower: tickArrayLowerPda.publicKey,
        tickArrayUpper: tickArrayUpperPda.publicKey,
    };
    const liquidityIx = !whirlpools_sdk_1.TokenExtensionUtil.isV2IxRequiredPool(tokenExtensionCtx)
        ? (0, instructions_1.increaseLiquidityIx)(ctx.program, baseParamsLiquidity)
        : (0, instructions_1.increaseLiquidityV2Ix)(ctx.program, {
            ...baseParamsLiquidity,
            tokenMintA: mintA,
            tokenMintB: mintB,
            tokenProgramA: tokenExtensionCtx.tokenMintWithProgramA.tokenProgram,
            tokenProgramB: tokenExtensionCtx.tokenMintWithProgramB.tokenProgram,
        });
    txBuilder.addInstruction(liquidityIx);
    const txPayload = await txBuilder.build({
        maxSupportedTransactionVersion: "legacy",
    });
    if (txPayload.transaction instanceof web3_js_1.Transaction) {
        try {
            const txId = await (0, send_tx_1.sendTx)(agent, txPayload.transaction, [
                positionMintKeypair,
                tokenVaultAKeypair,
                tokenVaultBKeypair,
            ]);
            return txId;
        }
        catch (error) {
            throw new Error(`Failed to create pool: ${JSON.stringify(error)}`);
        }
    }
    else {
        throw new Error("Failed to create pool: Transaction not created");
    }
}
//# sourceMappingURL=create_orca_single_sided_whirlpool.js.map