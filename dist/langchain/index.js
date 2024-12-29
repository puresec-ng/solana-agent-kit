"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTipLinkTool = exports.SolanaRockPaperScissorsTool = exports.SolanaCreateGibworkTask = exports.SolanaGetMainDomain = exports.SolanaGetAllTlds = exports.SolanaGetOwnedTldDomains = exports.SolanaGetOwnedDomains = exports.SolanaResolveAllDomainsTool = exports.SolanaPythFetchPrice = exports.SolanaOpenbookCreateMarket = exports.SolanaRaydiumCreateCpmm = exports.SolanaRaydiumCreateClmm = exports.SolanaRaydiumCreateAmmV4 = exports.SolanaCreateSingleSidedWhirlpoolTool = exports.SolanaCompressedAirdropTool = exports.SolanaTokenDataByTickerTool = exports.SolanaTokenDataTool = exports.SolanaFetchPriceTool = exports.SolanaStakeTool = exports.SolanaTPSCalculatorTool = exports.SolanaLendAssetTool = exports.SolanaCreateImageTool = exports.SolanaPumpfunTokenLaunchTool = exports.SolanaGetWalletAddressTool = exports.SolanaGetDomainTool = exports.SolanaResolveDomainTool = exports.SolanaRegisterDomainTool = exports.SolanaRequestFundsTool = exports.SolanaTradeTool = exports.SolanaMintNFTTool = exports.SolanaDeployCollectionTool = exports.SolanaDeployTokenTool = exports.SolanaTransferTool = exports.SolanaBalanceTool = void 0;
exports.createSolanaTools = createSolanaTools;
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = __importDefault(require("decimal.js"));
const tools_1 = require("langchain/tools");
const create_image_1 = require("../tools/create_image");
const anchor_1 = require("@coral-xyz/anchor");
const tools_2 = require("../tools");
const toJSON_1 = require("../utils/toJSON");
class SolanaBalanceTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_balance";
        this.description = `Get the balance of a Solana wallet or token account.

  If you want to get the balance of your wallet, you don't need to provide the tokenAddress.
  If no tokenAddress is provided, the balance will be in SOL.

  Inputs:
  tokenAddress: string, eg "So11111111111111111111111111111111111111112" (optional)`;
    }
    async _call(input) {
        try {
            const tokenAddress = input ? new web3_js_1.PublicKey(input) : undefined;
            const balance = await this.solanaKit.getBalance(tokenAddress);
            return JSON.stringify({
                status: "success",
                balance: balance,
                token: input || "SOL",
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaBalanceTool = SolanaBalanceTool;
class SolanaTransferTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_transfer";
        this.description = `Transfer tokens or SOL to another address ( also called as wallet address ).

  Inputs ( input is a JSON string ):
  to: string, eg "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk" (required)
  amount: number, eg 1 (required)
  mint?: string, eg "So11111111111111111111111111111111111111112" or "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa" (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const recipient = new web3_js_1.PublicKey(parsedInput.to);
            const mintAddress = parsedInput.mint
                ? new web3_js_1.PublicKey(parsedInput.mint)
                : undefined;
            const tx = await this.solanaKit.transfer(recipient, parsedInput.amount, mintAddress);
            return JSON.stringify({
                status: "success",
                message: "Transfer completed successfully",
                amount: parsedInput.amount,
                recipient: parsedInput.to,
                token: parsedInput.mint || "SOL",
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTransferTool = SolanaTransferTool;
class SolanaDeployTokenTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_deploy_token";
        this.description = `Deploy a new token on Solana blockchain.

  Inputs (input is a JSON string):
  name: string, eg "My Token" (required)
  uri: string, eg "https://example.com/token.json" (required)
  symbol: string, eg "MTK" (required)
  decimals?: number, eg 9 (optional, defaults to 9)
  initialSupply?: number, eg 1000000 (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.deployToken(parsedInput.name, parsedInput.uri, parsedInput.symbol, parsedInput.decimals, parsedInput.initialSupply);
            return JSON.stringify({
                status: "success",
                message: "Token deployed successfully",
                mintAddress: result.mint.toString(),
                decimals: parsedInput.decimals || 9,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaDeployTokenTool = SolanaDeployTokenTool;
class SolanaDeployCollectionTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_deploy_collection";
        this.description = `Deploy a new NFT collection on Solana blockchain.

  Inputs (input is a JSON string):
  name: string, eg "My Collection" (required)
  uri: string, eg "https://example.com/collection.json" (required)
  royaltyBasisPoints?: number, eg 500 for 5% (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.deployCollection(parsedInput);
            return JSON.stringify({
                status: "success",
                message: "Collection deployed successfully",
                collectionAddress: result.collectionAddress.toString(),
                name: parsedInput.name,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaDeployCollectionTool = SolanaDeployCollectionTool;
class SolanaMintNFTTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_mint_nft";
        this.description = `Mint a new NFT in a collection on Solana blockchain.

    Inputs (input is a JSON string):
    collectionMint: string, eg "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w" (required) - The address of the collection to mint into
    name: string, eg "My NFT" (required)
    uri: string, eg "https://example.com/nft.json" (required)
    recipient?: string, eg "9aUn5swQzUTRanaaTwmszxiv89cvFwUCjEBv1vZCoT1u" (optional) - The wallet to receive the NFT, defaults to agent's wallet which is ${this.solanaKit.wallet_address.toString()}`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const result = await this.solanaKit.mintNFT(new web3_js_1.PublicKey(parsedInput.collectionMint), {
                name: parsedInput.name,
                uri: parsedInput.uri,
            }, parsedInput.recipient
                ? new web3_js_1.PublicKey(parsedInput.recipient)
                : this.solanaKit.wallet_address);
            return JSON.stringify({
                status: "success",
                message: "NFT minted successfully",
                mintAddress: result.mint.toString(),
                metadata: {
                    name: parsedInput.name,
                    symbol: parsedInput.symbol,
                    uri: parsedInput.uri,
                },
                recipient: parsedInput.recipient || result.mint.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaMintNFTTool = SolanaMintNFTTool;
class SolanaTradeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_trade";
        this.description = `This tool can be used to swap tokens to another token ( It uses Jupiter Exchange ).

  Inputs ( input is a JSON string ):
  outputMint: string, eg "So11111111111111111111111111111111111111112" or "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa" (required)
  inputAmount: number, eg 1 or 0.01 (required)
  inputMint?: string, eg "So11111111111111111111111111111111111111112" (optional)
  slippageBps?: number, eg 100 (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const tx = await this.solanaKit.trade(new web3_js_1.PublicKey(parsedInput.outputMint), parsedInput.inputAmount, parsedInput.inputMint
                ? new web3_js_1.PublicKey(parsedInput.inputMint)
                : new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), parsedInput.slippageBps);
            return JSON.stringify({
                status: "success",
                message: "Trade executed successfully",
                transaction: tx,
                inputAmount: parsedInput.inputAmount,
                inputToken: parsedInput.inputMint || "SOL",
                outputToken: parsedInput.outputMint,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTradeTool = SolanaTradeTool;
class SolanaRequestFundsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_request_funds";
        this.description = "Request SOL from Solana faucet (devnet/testnet only)";
    }
    async _call(_input) {
        try {
            await this.solanaKit.requestFaucetFunds();
            return JSON.stringify({
                status: "success",
                message: "Successfully requested faucet funds",
                network: this.solanaKit.connection.rpcEndpoint.split("/")[2],
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRequestFundsTool = SolanaRequestFundsTool;
class SolanaRegisterDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_register_domain";
        this.description = `Register a .sol domain name for your wallet.

  Inputs:
  name: string, eg "pumpfun.sol" (required)
  spaceKB: number, eg 1 (optional, default is 1)
  `;
    }
    validateInput(input) {
        if (!input.name || typeof input.name !== "string") {
            throw new Error("name is required and must be a string");
        }
        if (input.spaceKB !== undefined &&
            (typeof input.spaceKB !== "number" || input.spaceKB <= 0)) {
            throw new Error("spaceKB must be a positive number when provided");
        }
    }
    async _call(input) {
        try {
            const parsedInput = (0, toJSON_1.toJSON)(input);
            this.validateInput(parsedInput);
            const tx = await this.solanaKit.registerDomain(parsedInput.name, parsedInput.spaceKB || 1);
            return JSON.stringify({
                status: "success",
                message: "Domain registered successfully",
                transaction: tx,
                domain: `${parsedInput.name}.sol`,
                spaceKB: parsedInput.spaceKB || 1,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRegisterDomainTool = SolanaRegisterDomainTool;
class SolanaResolveDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_resolve_domain";
        this.description = `Resolve ONLY .sol domain names to a Solana PublicKey.
  This tool is exclusively for .sol domains.
  DO NOT use this for other domain types like .blink, .bonk, etc.

  Inputs:
  domain: string, eg "pumpfun.sol" (required)
  `;
    }
    async _call(input) {
        try {
            const domain = input.trim();
            const publicKey = await this.solanaKit.resolveSolDomain(domain);
            return JSON.stringify({
                status: "success",
                message: "Domain resolved successfully",
                publicKey: publicKey.toBase58(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaResolveDomainTool = SolanaResolveDomainTool;
class SolanaGetDomainTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_domain";
        this.description = `Retrieve the .sol domain associated for a given account address.

  Inputs:
  account: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)
  `;
    }
    async _call(input) {
        try {
            const account = new web3_js_1.PublicKey(input.trim());
            const domain = await this.solanaKit.getPrimaryDomain(account);
            return JSON.stringify({
                status: "success",
                message: "Primary domain retrieved successfully",
                domain,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaGetDomainTool = SolanaGetDomainTool;
class SolanaGetWalletAddressTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_wallet_address";
        this.description = `Get the wallet address of the agent`;
    }
    async _call(_input) {
        return this.solanaKit.wallet_address.toString();
    }
}
exports.SolanaGetWalletAddressTool = SolanaGetWalletAddressTool;
class SolanaPumpfunTokenLaunchTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_launch_pumpfun_token";
        this.description = `This tool can be used to launch a token on Pump.fun,
   do not use this tool for any other purpose, or for creating SPL tokens.
   If the user asks you to chose the parameters, you should generate valid values.
   For generating the image, you can use the solana_create_image tool.

   Inputs:
   tokenName: string, eg "PumpFun Token",
   tokenTicker: string, eg "PUMP",
   description: string, eg "PumpFun Token is a token on the Solana blockchain",
   imageUrl: string, eg "https://i.imgur.com/UFm07Np_d.png`;
    }
    validateInput(input) {
        if (!input.tokenName || typeof input.tokenName !== "string") {
            throw new Error("tokenName is required and must be a string");
        }
        if (!input.tokenTicker || typeof input.tokenTicker !== "string") {
            throw new Error("tokenTicker is required and must be a string");
        }
        if (!input.description || typeof input.description !== "string") {
            throw new Error("description is required and must be a string");
        }
        if (!input.imageUrl || typeof input.imageUrl !== "string") {
            throw new Error("imageUrl is required and must be a string");
        }
        if (input.initialLiquiditySOL !== undefined &&
            typeof input.initialLiquiditySOL !== "number") {
            throw new Error("initialLiquiditySOL must be a number when provided");
        }
    }
    async _call(input) {
        try {
            // Parse and normalize input
            input = input.trim();
            const parsedInput = JSON.parse(input);
            this.validateInput(parsedInput);
            // Launch token with validated input
            await this.solanaKit.launchPumpFunToken(parsedInput.tokenName, parsedInput.tokenTicker, parsedInput.description, parsedInput.imageUrl, {
                twitter: parsedInput.twitter,
                telegram: parsedInput.telegram,
                website: parsedInput.website,
                initialLiquiditySOL: parsedInput.initialLiquiditySOL,
            });
            return JSON.stringify({
                status: "success",
                message: "Token launched successfully on Pump.fun",
                tokenName: parsedInput.tokenName,
                tokenTicker: parsedInput.tokenTicker,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaPumpfunTokenLaunchTool = SolanaPumpfunTokenLaunchTool;
class SolanaCreateImageTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_create_image";
        this.description = "Create an image using OpenAI's DALL-E. Input should be a string prompt for the image.";
    }
    validateInput(input) {
        if (typeof input !== "string" || input.trim().length === 0) {
            throw new Error("Input must be a non-empty string prompt");
        }
    }
    async _call(input) {
        try {
            this.validateInput(input);
            const result = await (0, create_image_1.create_image)(this.solanaKit, input.trim());
            return JSON.stringify({
                status: "success",
                message: "Image created successfully",
                ...result,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaCreateImageTool = SolanaCreateImageTool;
class SolanaLendAssetTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_lend_asset";
        this.description = `Lend idle USDC for yield using Lulo. ( only USDC is supported )

  Inputs (input is a json string):
  amount: number, eg 1, 0.01 (required)`;
    }
    async _call(input) {
        try {
            const amount = JSON.parse(input).amount || input;
            const tx = await this.solanaKit.lendAssets(amount);
            return JSON.stringify({
                status: "success",
                message: "Asset lent successfully",
                transaction: tx,
                amount: amount,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaLendAssetTool = SolanaLendAssetTool;
class SolanaTPSCalculatorTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_tps";
        this.description = "Get the current TPS of the Solana network";
    }
    async _call(_input) {
        try {
            const tps = await this.solanaKit.getTPS();
            return `Solana (mainnet-beta) current transactions per second: ${tps}`;
        }
        catch (error) {
            return `Error fetching TPS: ${error.message}`;
        }
    }
}
exports.SolanaTPSCalculatorTool = SolanaTPSCalculatorTool;
class SolanaStakeTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_stake";
        this.description = `This tool can be used to stake your SOL (Solana), also called as SOL staking or liquid staking.

  Inputs ( input is a JSON string ):
  amount: number, eg 1 or 0.01 (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input) || Number(input);
            const tx = await this.solanaKit.stake(parsedInput.amount);
            return JSON.stringify({
                status: "success",
                message: "Staked successfully",
                transaction: tx,
                amount: parsedInput.amount,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaStakeTool = SolanaStakeTool;
/**
 * Tool to fetch the price of a token in USDC
 */
class SolanaFetchPriceTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_fetch_price";
        this.description = `Fetch the price of a given token in USDC.

  Inputs:
  - tokenId: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"`;
    }
    async _call(input) {
        try {
            const price = await this.solanaKit.fetchTokenPrice(input.trim());
            return JSON.stringify({
                status: "success",
                tokenId: input.trim(),
                priceInUSDC: price,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaFetchPriceTool = SolanaFetchPriceTool;
class SolanaTokenDataTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_token_data";
        this.description = `Get the token data for a given token mint address

  Inputs: mintAddress is required.
  mintAddress: string, eg "So11111111111111111111111111111111111111112" (required)`;
    }
    async _call(input) {
        try {
            const parsedInput = input.trim();
            const tokenData = await this.solanaKit.getTokenDataByAddress(parsedInput);
            return JSON.stringify({
                status: "success",
                tokenData: tokenData,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTokenDataTool = SolanaTokenDataTool;
class SolanaTokenDataByTickerTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_token_data_by_ticker";
        this.description = `Get the token data for a given token ticker

  Inputs: ticker is required.
  ticker: string, eg "USDC" (required)`;
    }
    async _call(input) {
        try {
            const ticker = input.trim();
            const tokenData = await this.solanaKit.getTokenDataByTicker(ticker);
            return JSON.stringify({
                status: "success",
                tokenData: tokenData,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTokenDataByTickerTool = SolanaTokenDataByTickerTool;
class SolanaCompressedAirdropTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_compressed_airdrop";
        this.description = `Airdrop SPL tokens with ZK Compression (also called as airdropping tokens)

  Inputs (input is a JSON string):
  mintAddress: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" (required)
  amount: number, the amount of tokens to airdrop per recipient, e.g., 42 (required)
  decimals: number, the decimals of the token, e.g., 6 (required)
  recipients: string[], the recipient addresses, e.g., ["1nc1nerator11111111111111111111111111111111"] (required)
  priorityFeeInLamports: number, the priority fee in lamports. Default is 30_000. (optional)
  shouldLog: boolean, whether to log progress to stdout. Default is false. (optional)`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const txs = await this.solanaKit.sendCompressedAirdrop(parsedInput.mintAddress, parsedInput.amount, parsedInput.decimals, parsedInput.recipients, parsedInput.priorityFeeInLamports || 30000, parsedInput.shouldLog || false);
            return JSON.stringify({
                status: "success",
                message: `Airdropped ${parsedInput.amount} tokens to ${parsedInput.recipients.length} recipients.`,
                transactionHashes: txs,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaCompressedAirdropTool = SolanaCompressedAirdropTool;
class SolanaCreateSingleSidedWhirlpoolTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "create_orca_single_sided_whirlpool";
        this.description = `Create a single-sided Whirlpool with liquidity.

  Inputs (input is a JSON string):
  - depositTokenAmount: number, eg: 1000000000 (required, in units of deposit token including decimals)
  - depositTokenMint: string, eg: "DepositTokenMintAddress" (required, mint address of deposit token)
  - otherTokenMint: string, eg: "OtherTokenMintAddress" (required, mint address of other token)
  - initialPrice: number, eg: 0.001 (required, initial price of deposit token in terms of other token)
  - maxPrice: number, eg: 5.0 (required, maximum price at which liquidity is added)
  - feeTier: number, eg: 0.30 (required, fee tier for the pool)`;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const depositTokenAmount = new anchor_1.BN(inputFormat.depositTokenAmount);
            const depositTokenMint = new web3_js_1.PublicKey(inputFormat.depositTokenMint);
            const otherTokenMint = new web3_js_1.PublicKey(inputFormat.otherTokenMint);
            const initialPrice = new decimal_js_1.default(inputFormat.initialPrice);
            const maxPrice = new decimal_js_1.default(inputFormat.maxPrice);
            const feeTier = inputFormat.feeTier;
            if (!feeTier || !(feeTier in tools_2.FEE_TIERS)) {
                throw new Error(`Invalid feeTier. Available options: ${Object.keys(tools_2.FEE_TIERS).join(", ")}`);
            }
            const txId = await this.solanaKit.createOrcaSingleSidedWhirlpool(depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier);
            return JSON.stringify({
                status: "success",
                message: "Single-sided Whirlpool created successfully",
                transaction: txId,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaCreateSingleSidedWhirlpoolTool = SolanaCreateSingleSidedWhirlpoolTool;
class SolanaRaydiumCreateAmmV4 extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_ammV4";
        this.description = `Raydium's Legacy AMM that requiers an OpenBook marketID

  Inputs (input is a json string):
  marketId: string (required)
  baseAmount: number(int), eg: 111111 (required)
  quoteAmount: number(int), eg: 111111 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateAmmV4(new web3_js_1.PublicKey(inputFormat.marketId), new anchor_1.BN(inputFormat.baseAmount), new anchor_1.BN(inputFormat.quoteAmount), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Create raydium amm v4 pool successfully",
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRaydiumCreateAmmV4 = SolanaRaydiumCreateAmmV4;
class SolanaRaydiumCreateClmm extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_clmm";
        this.description = `Concentrated liquidity market maker, custom liquidity ranges, increased capital efficiency

  Inputs (input is a json string):
  mint1: string (required)
  mint2: string (required)
  configId: string (required) stores pool info, id, index, protocolFeeRate, tradeFeeRate, tickSpacing, fundFeeRate
  initialPrice: number, eg: 123.12 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateClmm(new web3_js_1.PublicKey(inputFormat.mint1), new web3_js_1.PublicKey(inputFormat.mint2), new web3_js_1.PublicKey(inputFormat.configId), new decimal_js_1.default(inputFormat.initialPrice), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Create raydium clmm pool successfully",
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRaydiumCreateClmm = SolanaRaydiumCreateClmm;
class SolanaRaydiumCreateCpmm extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "raydium_create_cpmm";
        this.description = `Raydium's newest CPMM, does not require marketID, supports Token 2022 standard

  Inputs (input is a json string):
  mint1: string (required)
  mint2: string (required)
  configId: string (required), stores pool info, index, protocolFeeRate, tradeFeeRate, fundFeeRate, createPoolFee
  mintAAmount: number(int), eg: 1111 (required)
  mintBAmount: number(int), eg: 2222 (required)
  startTime: number(seconds), eg: now number or zero (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.raydiumCreateCpmm(new web3_js_1.PublicKey(inputFormat.mint1), new web3_js_1.PublicKey(inputFormat.mint2), new web3_js_1.PublicKey(inputFormat.configId), new anchor_1.BN(inputFormat.mintAAmount), new anchor_1.BN(inputFormat.mintBAmount), new anchor_1.BN(inputFormat.startTime));
            return JSON.stringify({
                status: "success",
                message: "Create raydium cpmm pool successfully",
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRaydiumCreateCpmm = SolanaRaydiumCreateCpmm;
class SolanaOpenbookCreateMarket extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_openbook_create_market";
        this.description = `Openbook marketId, required for ammv4

  Inputs (input is a json string):
  baseMint: string (required)
  quoteMint: string (required)
  lotSize: number (required)
  tickSize: number (required)
  `;
    }
    async _call(input) {
        try {
            const inputFormat = JSON.parse(input);
            const tx = await this.solanaKit.openbookCreateMarket(new web3_js_1.PublicKey(inputFormat.baseMint), new web3_js_1.PublicKey(inputFormat.quoteMint), inputFormat.lotSize, inputFormat.tickSize);
            return JSON.stringify({
                status: "success",
                message: "Create openbook market successfully",
                transaction: tx,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaOpenbookCreateMarket = SolanaOpenbookCreateMarket;
class SolanaPythFetchPrice extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_pyth_fetch_price";
        this.description = `Fetch the price of a given price feed from Pyth's Hermes service

  Inputs:
  priceFeedID: string, the price feed ID, e.g., "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43" for BTC/USD`;
    }
    async _call(input) {
        try {
            const price = await this.solanaKit.pythFetchPrice(input);
            const response = {
                status: "success",
                priceFeedID: input,
                price: price,
            };
            return JSON.stringify(response);
        }
        catch (error) {
            const response = {
                status: "error",
                priceFeedID: input,
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            };
            return JSON.stringify(response);
        }
    }
}
exports.SolanaPythFetchPrice = SolanaPythFetchPrice;
class SolanaResolveAllDomainsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_resolve_all_domains";
        this.description = `Resolve domain names to a public key for ALL domain types EXCEPT .sol domains.
  Use this for domains like .blink, .bonk, etc.
  DO NOT use this for .sol domains (use solana_resolve_domain instead).

  Input:
  domain: string, eg "mydomain.blink" or "mydomain.bonk" (required)`;
    }
    async _call(input) {
        try {
            const owner = await this.solanaKit.resolveAllDomains(input);
            if (!owner) {
                return JSON.stringify({
                    status: "error",
                    message: "Domain not found",
                    code: "DOMAIN_NOT_FOUND",
                });
            }
            return JSON.stringify({
                status: "success",
                message: "Domain resolved successfully",
                owner: owner?.toString(),
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "DOMAIN_RESOLUTION_ERROR",
            });
        }
    }
}
exports.SolanaResolveAllDomainsTool = SolanaResolveAllDomainsTool;
class SolanaGetOwnedDomains extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_owned_domains";
        this.description = `Get all domains owned by a specific wallet address.

  Inputs:
  owner: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)`;
    }
    async _call(input) {
        try {
            const ownerPubkey = new web3_js_1.PublicKey(input.trim());
            const domains = await this.solanaKit.getOwnedAllDomains(ownerPubkey);
            return JSON.stringify({
                status: "success",
                message: "Owned domains fetched successfully",
                domains: domains,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_OWNED_DOMAINS_ERROR",
            });
        }
    }
}
exports.SolanaGetOwnedDomains = SolanaGetOwnedDomains;
class SolanaGetOwnedTldDomains extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_owned_tld_domains";
        this.description = `Get all domains owned by the agent's wallet for a specific TLD.

  Inputs:
  tld: string, eg "bonk" (required)`;
    }
    async _call(input) {
        try {
            const domains = await this.solanaKit.getOwnedDomainsForTLD(input);
            return JSON.stringify({
                status: "success",
                message: "TLD domains fetched successfully",
                domains: domains,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TLD_DOMAINS_ERROR",
            });
        }
    }
}
exports.SolanaGetOwnedTldDomains = SolanaGetOwnedTldDomains;
class SolanaGetAllTlds extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_all_tlds";
        this.description = `Get all active top-level domains (TLDs) in the AllDomains Name Service`;
    }
    async _call() {
        try {
            const tlds = await this.solanaKit.getAllDomainsTLDs();
            return JSON.stringify({
                status: "success",
                message: "TLDs fetched successfully",
                tlds: tlds,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_TLDS_ERROR",
            });
        }
    }
}
exports.SolanaGetAllTlds = SolanaGetAllTlds;
class SolanaGetMainDomain extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_get_main_domain";
        this.description = `Get the main/favorite domain for a given wallet address.

  Inputs:
  owner: string, eg "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t" (required)`;
    }
    async _call(input) {
        try {
            const ownerPubkey = new web3_js_1.PublicKey(input.trim());
            const mainDomain = await this.solanaKit.getMainAllDomainsDomain(ownerPubkey);
            return JSON.stringify({
                status: "success",
                message: "Main domain fetched successfully",
                domain: mainDomain,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "FETCH_MAIN_DOMAIN_ERROR",
            });
        }
    }
}
exports.SolanaGetMainDomain = SolanaGetMainDomain;
class SolanaCreateGibworkTask extends tools_1.Tool {
    constructor(solanaSdk) {
        super();
        this.solanaSdk = solanaSdk;
        this.name = "create_gibwork_task";
        this.description = `Create a task on Gibwork.

  Inputs (input is a JSON string):
  title: string, title of the task (required)
  content: string, description of the task (required)
  requirements: string, requirements to complete the task (required)
  tags: string[], list of tags associated with the task (required)
  payer: string, payer address (optional, defaults to agent wallet)
  tokenMintAddress: string, the mint address of the token, e.g., "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" (required)
  amount: number, payment amount (required)
  `;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            const taskData = await this.solanaSdk.createGibworkTask(parsedInput.title, parsedInput.content, parsedInput.requirements, parsedInput.tags, parsedInput.tokenMintAddress, parsedInput.amount, parsedInput.payer);
            const response = {
                status: "success",
                taskId: taskData.taskId,
                signature: taskData.signature,
            };
            return JSON.stringify(response);
        }
        catch (err) {
            return JSON.stringify({
                status: "error",
                message: err.message,
                code: err.code || "CREATE_TASK_ERROR",
            });
        }
    }
}
exports.SolanaCreateGibworkTask = SolanaCreateGibworkTask;
class SolanaRockPaperScissorsTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "rock_paper_scissors";
        this.description = `Play rock paper scissors to win SEND coins.

  Inputs (input is a JSON string):
  choice: string, either "rock", "paper", or "scissors" (required)
  amount: number, amount of SOL to play with - must be 0.1, 0.01, or 0.005 SOL (required)`;
    }
    validateInput(input) {
        if (input.choice !== undefined) {
            throw new Error("choice is required.");
        }
        if (input.amount !== undefined &&
            (typeof input.spaceKB !== "number" || input.spaceKB <= 0)) {
            throw new Error("amount must be a positive number when provided");
        }
    }
    async _call(input) {
        try {
            const parsedInput = (0, toJSON_1.toJSON)(input);
            this.validateInput(parsedInput);
            const result = await this.solanaKit.rockPaperScissors(Number(parsedInput['"amount"']), parsedInput['"choice"'].replace(/^"|"$/g, ""));
            return JSON.stringify({
                status: "success",
                message: result,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaRockPaperScissorsTool = SolanaRockPaperScissorsTool;
class SolanaTipLinkTool extends tools_1.Tool {
    constructor(solanaKit) {
        super();
        this.solanaKit = solanaKit;
        this.name = "solana_tiplink";
        this.description = `Create a TipLink for transferring SOL or SPL tokens.
  Input is a JSON string with:
  - amount: number (required) - Amount to transfer
  - splmintAddress: string (optional) - SPL token mint address`;
    }
    async _call(input) {
        try {
            const parsedInput = JSON.parse(input);
            if (!parsedInput.amount) {
                throw new Error("Amount is required");
            }
            const amount = parseFloat(parsedInput.amount);
            const splmintAddress = parsedInput.splmintAddress
                ? new web3_js_1.PublicKey(parsedInput.splmintAddress)
                : undefined;
            const { url, signature } = await this.solanaKit.createTiplink(amount, splmintAddress);
            return JSON.stringify({
                status: "success",
                url,
                signature,
                amount,
                tokenType: splmintAddress ? "SPL" : "SOL",
                message: `TipLink created successfully`,
            });
        }
        catch (error) {
            return JSON.stringify({
                status: "error",
                message: error.message,
                code: error.code || "UNKNOWN_ERROR",
            });
        }
    }
}
exports.SolanaTipLinkTool = SolanaTipLinkTool;
function createSolanaTools(solanaKit) {
    return [
        new SolanaBalanceTool(solanaKit),
        new SolanaTransferTool(solanaKit),
        new SolanaDeployTokenTool(solanaKit),
        new SolanaDeployCollectionTool(solanaKit),
        new SolanaMintNFTTool(solanaKit),
        new SolanaTradeTool(solanaKit),
        new SolanaRequestFundsTool(solanaKit),
        new SolanaRegisterDomainTool(solanaKit),
        new SolanaGetWalletAddressTool(solanaKit),
        new SolanaPumpfunTokenLaunchTool(solanaKit),
        new SolanaCreateImageTool(solanaKit),
        new SolanaLendAssetTool(solanaKit),
        new SolanaTPSCalculatorTool(solanaKit),
        new SolanaStakeTool(solanaKit),
        new SolanaFetchPriceTool(solanaKit),
        new SolanaGetDomainTool(solanaKit),
        new SolanaTokenDataTool(solanaKit),
        new SolanaTokenDataByTickerTool(solanaKit),
        new SolanaCompressedAirdropTool(solanaKit),
        new SolanaRaydiumCreateAmmV4(solanaKit),
        new SolanaRaydiumCreateClmm(solanaKit),
        new SolanaRaydiumCreateCpmm(solanaKit),
        new SolanaOpenbookCreateMarket(solanaKit),
        new SolanaCreateSingleSidedWhirlpoolTool(solanaKit),
        new SolanaPythFetchPrice(solanaKit),
        new SolanaResolveDomainTool(solanaKit),
        new SolanaGetOwnedDomains(solanaKit),
        new SolanaGetOwnedTldDomains(solanaKit),
        new SolanaGetAllTlds(solanaKit),
        new SolanaGetMainDomain(solanaKit),
        new SolanaResolveAllDomainsTool(solanaKit),
        new SolanaCreateGibworkTask(solanaKit),
        new SolanaRockPaperScissorsTool(solanaKit),
        new SolanaTipLinkTool(solanaKit),
    ];
}
//# sourceMappingURL=index.js.map