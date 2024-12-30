import {
  VersionedTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SolanaAgentKit } from "../index";
import { TOKENS, DEFAULT_OPTIONS, JUP_API } from "../constants";
import { getMint } from '@solana/spl-token';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

/**
 * Swap tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param outputMint Target token mint address
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @param slippageBps Slippage tolerance in basis points (default: 300 = 3%)
 * @returns Transaction signature
 */
export async function trade(
  agent: SolanaAgentKit,
  outputMint: PublicKey,
  inputAmount: number,
  inputMint: PublicKey = TOKENS.USDC,
  slippageBps: number = DEFAULT_OPTIONS.SLIPPAGE_BPS,
): Promise<string> {
  try {
    const fees_account: { [key: string]: string } = {
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
    const mintInfo = await getMint(
      agent.connection,
      new PublicKey(inputMint),
    );
    const inputTokenDecimals = mintInfo.decimals;
    const multiplier = Math.pow(10, inputTokenDecimals);

    const quoteResponse = await (
      await fetch(
        `${JUP_API}/quote?` +
        `inputMint=${inputMint.toString()}` +
        `&outputMint=${outputMint.toString()}` +
        `&amount=${inputAmount * multiplier}` +
        `&slippageBps=${slippageBps}` +
        // `&onlyDirectRoutes=true` +
        // `&maxAccounts=20` +
        `&platformFeeBps=10`,
      )
    ).json();

    // Prepare swap request body
    const swapRequestBody: {
      quoteResponse: any;
      userPublicKey: string;
      wrapAndUnwrapSol: boolean;
      dynamicComputeUnitLimit: boolean;
      prioritizationFeeLamports: string;
      feeAccount?: string;
    } = {
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
    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(swapRequestBody),
      })
    ).json();

    // Deserialize transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Sign and send transaction
    transaction.sign([agent.wallet]);
    const signature = await agent.connection.sendTransaction(transaction);
    
    return signature;
  } catch (error: any) {
    throw new Error(`Swap failed: ${error.message}`);
  }
}