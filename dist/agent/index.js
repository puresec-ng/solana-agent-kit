"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAgentKit = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const constants_1 = require("../constants");
const tools_1 = require("../tools");
/**
 * Main class for interacting with Solana blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class SolanaAgentKit
 * @property {Connection} connection - Solana RPC connection
 * @property {Keypair} wallet - Wallet keypair for signing transactions
 * @property {PublicKey} wallet_address - Public key of the wallet
 */
class SolanaAgentKit {
    constructor(private_key, rpc_url = "https://api.mainnet-beta.solana.com", openai_api_key) {
        this.connection = new web3_js_1.Connection(rpc_url);
        this.wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(private_key));
        this.wallet_address = this.wallet.publicKey;
        this.openai_api_key = openai_api_key;
    }
    // Tool methods
    async requestFaucetFunds() {
        return (0, tools_1.request_faucet_funds)(this);
    }
    async deployToken(name, uri, symbol, decimals = constants_1.DEFAULT_OPTIONS.TOKEN_DECIMALS, initialSupply) {
        return (0, tools_1.deploy_token)(this, name, uri, symbol, decimals, initialSupply);
    }
    async deployCollection(options) {
        return (0, tools_1.deploy_collection)(this, options);
    }
    async getBalance(token_address) {
        return (0, tools_1.get_balance)(this, token_address);
    }
    async mintNFT(collectionMint, metadata, recipient) {
        return (0, tools_1.mintCollectionNFT)(this, collectionMint, metadata, recipient);
    }
    async transfer(to, amount, mint) {
        return (0, tools_1.transfer)(this, to, amount, mint);
    }
    async registerDomain(name, spaceKB) {
        return (0, tools_1.registerDomain)(this, name, spaceKB);
    }
    async resolveSolDomain(domain) {
        return (0, tools_1.resolveSolDomain)(this, domain);
    }
    async getPrimaryDomain(account) {
        return (0, tools_1.getPrimaryDomain)(this, account);
    }
    async trade(outputMint, inputAmount, inputMint, slippageBps = constants_1.DEFAULT_OPTIONS.SLIPPAGE_BPS) {
        return (0, tools_1.trade)(this, outputMint, inputAmount, inputMint, slippageBps);
    }
    async lendAssets(amount) {
        return (0, tools_1.lendAsset)(this, amount);
    }
    async getTPS() {
        return (0, tools_1.getTPS)(this);
    }
    async getTokenDataByAddress(mint) {
        return (0, tools_1.getTokenDataByAddress)(new web3_js_1.PublicKey(mint));
    }
    async getTokenDataByTicker(ticker) {
        return (0, tools_1.getTokenDataByTicker)(ticker);
    }
    async fetchTokenPrice(mint) {
        return (0, tools_1.fetchPrice)(new web3_js_1.PublicKey(mint));
    }
    async launchPumpFunToken(tokenName, tokenTicker, description, imageUrl, options) {
        return (0, tools_1.launchPumpFunToken)(this, tokenName, tokenTicker, description, imageUrl, options);
    }
    async stake(amount) {
        return (0, tools_1.stakeWithJup)(this, amount);
    }
    async sendCompressedAirdrop(mintAddress, amount, decimals, recipients, priorityFeeInLamports, shouldLog) {
        return await (0, tools_1.sendCompressedAirdrop)(this, new web3_js_1.PublicKey(mintAddress), amount, decimals, recipients.map((recipient) => new web3_js_1.PublicKey(recipient)), priorityFeeInLamports, shouldLog);
    }
    async createOrcaSingleSidedWhirlpool(depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier) {
        return (0, tools_1.createOrcaSingleSidedWhirlpool)(this, depositTokenAmount, depositTokenMint, otherTokenMint, initialPrice, maxPrice, feeTier);
    }
    async resolveAllDomains(domain) {
        return (0, tools_1.resolveAllDomains)(this, domain);
    }
    async getOwnedAllDomains(owner) {
        return (0, tools_1.getOwnedAllDomains)(this, owner);
    }
    async getOwnedDomainsForTLD(tld) {
        return (0, tools_1.getOwnedDomainsForTLD)(this, tld);
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    async getAllDomainsTLDs() {
        return (0, tools_1.getAllDomainsTLDs)(this);
    }
    async getAllRegisteredAllDomains() {
        return (0, tools_1.getAllRegisteredAllDomains)(this);
    }
    async getMainAllDomainsDomain(owner) {
        return (0, tools_1.getMainAllDomainsDomain)(this, owner);
    }
    async raydiumCreateAmmV4(marketId, baseAmount, quoteAmount, startTime) {
        return (0, tools_1.raydiumCreateAmmV4)(this, marketId, baseAmount, quoteAmount, startTime);
    }
    async raydiumCreateClmm(mint1, mint2, configId, initialPrice, startTime) {
        return (0, tools_1.raydiumCreateClmm)(this, mint1, mint2, configId, initialPrice, startTime);
    }
    async raydiumCreateCpmm(mint1, mint2, configId, mintAAmount, mintBAmount, startTime) {
        return (0, tools_1.raydiumCreateCpmm)(this, mint1, mint2, configId, mintAAmount, mintBAmount, startTime);
    }
    async openbookCreateMarket(baseMint, quoteMint, lotSize = 1, tickSize = 0.01) {
        return (0, tools_1.openbookCreateMarket)(this, baseMint, quoteMint, lotSize, tickSize);
    }
    async pythFetchPrice(priceFeedID) {
        return (0, tools_1.pythFetchPrice)(priceFeedID);
    }
    async createGibworkTask(title, content, requirements, tags, tokenMintAddress, tokenAmount, payer) {
        return (0, tools_1.create_gibwork_task)(this, title, content, requirements, tags, new web3_js_1.PublicKey(tokenMintAddress), tokenAmount, payer ? new web3_js_1.PublicKey(payer) : undefined);
    }
    async rockPaperScissors(amount, choice) {
        return (0, tools_1.rock_paper_scissor)(this, amount, choice);
    }
    async createTiplink(amount, splmintAddress) {
        return (0, tools_1.create_TipLink)(this, amount, splmintAddress);
    }
}
exports.SolanaAgentKit = SolanaAgentKit;
//# sourceMappingURL=index.js.map