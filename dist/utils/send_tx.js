"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriorityFees = getPriorityFees;
exports.sendTx = sendTx;
const web3_js_1 = require("@solana/web3.js");
/**
 * Get priority fees for the current block
 * @param connection - Solana RPC connection
 * @returns Priority fees statistics and instructions for different fee levels
 */
async function getPriorityFees(connection) {
    try {
        // Get recent prioritization fees
        const priorityFees = await connection.getRecentPrioritizationFees();
        if (!priorityFees.length) {
            return {
                min: 0,
                median: 0,
                max: 0,
            };
        }
        // Sort fees by value
        const sortedFees = priorityFees
            .map((x) => x.prioritizationFee)
            .sort((a, b) => a - b);
        // Calculate statistics
        const min = sortedFees[0] ?? 0;
        const max = sortedFees[sortedFees.length - 1] ?? 0;
        const mid = Math.floor(sortedFees.length / 2);
        const median = sortedFees.length % 2 === 0
            ? ((sortedFees[mid - 1] ?? 0) + (sortedFees[mid] ?? 0)) / 2
            : (sortedFees[mid] ?? 0);
        // Helper to create priority fee IX based on chosen strategy
        const createPriorityFeeIx = (fee) => {
            return web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: fee,
            });
        };
        return {
            min,
            median,
            max,
            // Return instructions for different fee levels
            instructions: {
                low: createPriorityFeeIx(min),
                medium: createPriorityFeeIx(median),
                high: createPriorityFeeIx(max),
            },
        };
    }
    catch (error) {
        console.error("Error getting priority fees:", error);
        throw error;
    }
}
/**
 * Send a transaction with priority fees
 * @param agent - SolanaAgentKit instance
 * @param tx - Transaction to send
 * @returns Transaction ID
 */
async function sendTx(agent, tx, otherKeypairs) {
    tx.recentBlockhash = (await agent.connection.getLatestBlockhash()).blockhash;
    tx.feePayer = agent.wallet_address;
    const fees = await getPriorityFees(agent.connection);
    if (fees.instructions) {
        tx.add(fees.instructions.medium);
    }
    tx.sign(agent.wallet, ...(otherKeypairs ?? []));
    const txid = await agent.connection.sendRawTransaction(tx.serialize());
    await agent.connection.confirmTransaction({
        signature: txid,
        blockhash: (await agent.connection.getLatestBlockhash()).blockhash,
        lastValidBlockHeight: (await agent.connection.getLatestBlockhash())
            .lastValidBlockHeight,
    });
    return txid;
}
//# sourceMappingURL=send_tx.js.map