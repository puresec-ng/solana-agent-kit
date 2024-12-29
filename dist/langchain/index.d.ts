import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../index";
export declare class SolanaBalanceTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaTransferTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaDeployTokenTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaDeployCollectionTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaMintNFTTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaTradeTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaRequestFundsTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(_input: string): Promise<string>;
}
export declare class SolanaRegisterDomainTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
export declare class SolanaResolveDomainTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaGetDomainTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaGetWalletAddressTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(_input: string): Promise<string>;
}
export declare class SolanaPumpfunTokenLaunchTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
export declare class SolanaCreateImageTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
export declare class SolanaLendAssetTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaTPSCalculatorTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(_input: string): Promise<string>;
}
export declare class SolanaStakeTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
/**
 * Tool to fetch the price of a token in USDC
 */
export declare class SolanaFetchPriceTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaTokenDataTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaTokenDataByTickerTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaCompressedAirdropTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaCreateSingleSidedWhirlpoolTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaRaydiumCreateAmmV4 extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaRaydiumCreateClmm extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaRaydiumCreateCpmm extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaOpenbookCreateMarket extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaPythFetchPrice extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaResolveAllDomainsTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaGetOwnedDomains extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaGetOwnedTldDomains extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaGetAllTlds extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(): Promise<string>;
}
export declare class SolanaGetMainDomain extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    _call(input: string): Promise<string>;
}
export declare class SolanaCreateGibworkTask extends Tool {
    private solanaSdk;
    name: string;
    description: string;
    constructor(solanaSdk: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare class SolanaRockPaperScissorsTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    private validateInput;
    protected _call(input: string): Promise<string>;
}
export declare class SolanaTipLinkTool extends Tool {
    private solanaKit;
    name: string;
    description: string;
    constructor(solanaKit: SolanaAgentKit);
    protected _call(input: string): Promise<string>;
}
export declare function createSolanaTools(solanaKit: SolanaAgentKit): (SolanaBalanceTool | SolanaTransferTool | SolanaDeployTokenTool | SolanaDeployCollectionTool | SolanaMintNFTTool | SolanaTradeTool | SolanaRequestFundsTool | SolanaRegisterDomainTool | SolanaResolveDomainTool | SolanaGetDomainTool | SolanaGetWalletAddressTool | SolanaPumpfunTokenLaunchTool | SolanaCreateImageTool | SolanaLendAssetTool | SolanaTPSCalculatorTool | SolanaStakeTool | SolanaFetchPriceTool | SolanaTokenDataTool | SolanaTokenDataByTickerTool | SolanaCompressedAirdropTool | SolanaCreateSingleSidedWhirlpoolTool | SolanaRaydiumCreateAmmV4 | SolanaRaydiumCreateClmm | SolanaRaydiumCreateCpmm | SolanaOpenbookCreateMarket | SolanaPythFetchPrice | SolanaResolveAllDomainsTool | SolanaGetOwnedDomains | SolanaGetOwnedTldDomains | SolanaGetAllTlds | SolanaGetMainDomain | SolanaCreateGibworkTask | SolanaRockPaperScissorsTool | SolanaTipLinkTool)[];
//# sourceMappingURL=index.d.ts.map