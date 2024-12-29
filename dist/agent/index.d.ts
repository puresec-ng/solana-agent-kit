import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";
import { mintCollectionNFT, FEE_TIERS } from "../tools";
import { CollectionDeployment, CollectionOptions, GibworkCreateTaskReponse, JupiterTokenData, MintCollectionNFTResponse, PumpfunLaunchResponse, PumpFunTokenOptions } from "../types";
import { BN } from "@coral-xyz/anchor";
/**
 * Main class for interacting with Solana blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class SolanaAgentKit
 * @property {Connection} connection - Solana RPC connection
 * @property {Keypair} wallet - Wallet keypair for signing transactions
 * @property {PublicKey} wallet_address - Public key of the wallet
 */
export declare class SolanaAgentKit {
    connection: Connection;
    wallet: Keypair;
    wallet_address: PublicKey;
    openai_api_key: string;
    constructor(private_key: string, rpc_url: string | undefined, openai_api_key: string);
    requestFaucetFunds(): Promise<string>;
    deployToken(name: string, uri: string, symbol: string, decimals?: number, initialSupply?: number): Promise<{
        mint: PublicKey;
    }>;
    deployCollection(options: CollectionOptions): Promise<CollectionDeployment>;
    getBalance(token_address?: PublicKey): Promise<number>;
    mintNFT(collectionMint: PublicKey, metadata: Parameters<typeof mintCollectionNFT>[2], recipient?: PublicKey): Promise<MintCollectionNFTResponse>;
    transfer(to: PublicKey, amount: number, mint?: PublicKey): Promise<string>;
    registerDomain(name: string, spaceKB?: number): Promise<string>;
    resolveSolDomain(domain: string): Promise<PublicKey>;
    getPrimaryDomain(account: PublicKey): Promise<string>;
    trade(outputMint: PublicKey, inputAmount: number, inputMint?: PublicKey, slippageBps?: number): Promise<string>;
    lendAssets(amount: number): Promise<string>;
    getTPS(): Promise<number>;
    getTokenDataByAddress(mint: string): Promise<JupiterTokenData | undefined>;
    getTokenDataByTicker(ticker: string): Promise<JupiterTokenData | undefined>;
    fetchTokenPrice(mint: string): Promise<string>;
    launchPumpFunToken(tokenName: string, tokenTicker: string, description: string, imageUrl: string, options?: PumpFunTokenOptions): Promise<PumpfunLaunchResponse>;
    stake(amount: number): Promise<string>;
    sendCompressedAirdrop(mintAddress: string, amount: number, decimals: number, recipients: string[], priorityFeeInLamports: number, shouldLog: boolean): Promise<string[]>;
    createOrcaSingleSidedWhirlpool(depositTokenAmount: BN, depositTokenMint: PublicKey, otherTokenMint: PublicKey, initialPrice: Decimal, maxPrice: Decimal, feeTier: keyof typeof FEE_TIERS): Promise<string>;
    resolveAllDomains(domain: string): Promise<PublicKey | undefined>;
    getOwnedAllDomains(owner: PublicKey): Promise<string[]>;
    getOwnedDomainsForTLD(tld: string): Promise<string[]>;
    getAllDomainsTLDs(): Promise<String[]>;
    getAllRegisteredAllDomains(): Promise<string[]>;
    getMainAllDomainsDomain(owner: PublicKey): Promise<string | null>;
    raydiumCreateAmmV4(marketId: PublicKey, baseAmount: BN, quoteAmount: BN, startTime: BN): Promise<string>;
    raydiumCreateClmm(mint1: PublicKey, mint2: PublicKey, configId: PublicKey, initialPrice: Decimal, startTime: BN): Promise<string>;
    raydiumCreateCpmm(mint1: PublicKey, mint2: PublicKey, configId: PublicKey, mintAAmount: BN, mintBAmount: BN, startTime: BN): Promise<string>;
    openbookCreateMarket(baseMint: PublicKey, quoteMint: PublicKey, lotSize?: number, tickSize?: number): Promise<string[]>;
    pythFetchPrice(priceFeedID: string): Promise<string>;
    createGibworkTask(title: string, content: string, requirements: string, tags: string[], tokenMintAddress: string, tokenAmount: number, payer?: string): Promise<GibworkCreateTaskReponse>;
    rockPaperScissors(amount: number, choice: "rock" | "paper" | "scissors"): Promise<string>;
    createTiplink(amount: number, splmintAddress?: PublicKey): Promise<{
        url: string;
        signature: string;
    }>;
}
//# sourceMappingURL=index.d.ts.map