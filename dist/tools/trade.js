"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trade = trade;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const spl_token_1 = require("@solana/spl-token");
/**
 * Swap tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param outputMint Target token mint address
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @param slippageBps Slippage tolerance in basis points (default: 300 = 3%)
 * @returns Transaction signature
 */
async function trade(agent, outputMint, inputAmount, inputMint = constants_1.TOKENS.USDC, slippageBps = constants_1.DEFAULT_OPTIONS.SLIPPAGE_BPS) {
    try {
        const fees_account = {
            '8c71AvjQeKKeWRe8jtTGG1bJ2WiYXQdbjqFbUfhHgSVk': 'H4UvLXSWaUeeDLowYxERvxjuyz7k3g46q2VE9E1QEcAw',
            'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'fMQLxC1Ugpj8UauENcbrF7TusRqi3qErYTx74rZGTNr',
            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': "GV3ES46gqBXn8r316vyyUUmpdruaCfiWYkKpP4rmqJ5x",
            "sRLY3migNrkC1HLgqotpvi66qGkdNedqPZ9TJpAQhyh": "4wUH6GfvCEQ1i5DnpRnxjhzkaRxTJdwpWqqmtjgBeAiT",
            "4yoWgpCg5KciCPuA6LxDFpJHa53Jjj6XU9RLFJCgdakL": "FbQZ7aLfsgaKQM371qeD1T7TRvnta7JJHv3Sos5iCVdS",
            "So11111111111111111111111111111111111111112": "28L7quCeKmHvQcoGiZie8gGkVDP4cTzqiAvHwgEsGj5C",
            "8kJS4DrxWx8ibuBcaJY968F8wju2u9AcdiSMWhiEiwEh": "5oKe6iiaDKzDCqszRmMzMdFA1LnEY9WpCdGjKfweWyJR",
            "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "29zb8hoqpsxS7ySVzA6SaTnEFwV3xUoxc2eSs3EspGzC"
        };
        // Get token decimal places using Solana's getMint function
        const mintInfo = await (0, spl_token_1.getMint)(agent.connection, new web3_js_1.PublicKey(inputMint));
        const inputTokenDecimals = mintInfo.decimals;
        const multiplier = Math.pow(10, inputTokenDecimals);
        const quoteResponse = await (await fetch(`${constants_1.JUP_API}/quote?` +
            `inputMint=${inputMint.toString()}` +
            `&outputMint=${outputMint.toString()}` +
            `&amount=${inputAmount * multiplier}` +
            `&slippageBps=${slippageBps}` +
            `&onlyDirectRoutes=true` +
            `&maxAccounts=20`)).json();
        // Prepare swap request body
        const swapRequestBody = {
            quoteResponse,
            userPublicKey: agent.wallet_address.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: "auto",
        };
        // Add fees account if it exists for the input token
        if (fees_account[inputMint.toString()]) {
            swapRequestBody.feeAccount = fees_account[inputMint.toString()];
        }
        // Get serialized transaction
        const { swapTransaction } = await (await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(swapRequestBody),
        })).json();
        // Deserialize transaction
        const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
        const transaction = web3_js_1.VersionedTransaction.deserialize(swapTransactionBuf);
        // Sign and send transaction
        transaction.sign([agent.wallet]);
        const signature = await agent.connection.sendTransaction(transaction);
        return signature;
    }
    catch (error) {
        throw new Error(`Swap failed: ${error.message}`);
    }
}
//# sourceMappingURL=trade.js.map