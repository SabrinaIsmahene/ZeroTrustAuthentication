import { ethers, Contract, EventLog } from "ethers"
import { EventEmitter } from "events"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { loadMembers, saveMembers, addMember, removeMember, updateMember, saveGroupId } from "./groupStorage"

dotenv.config()

if (!process.env.ABI_PATH || !process.env.RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
    throw new Error("\nEnvironnement Variables not found.")
}

const abiPath = path.resolve(process.env.ABI_PATH)
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"))
const { abi: contractAbi } = contractJson
const { CONTRACT_ADDRESS, RPC_URL, PRIVATE_KEY } = process.env
const provider = new ethers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(PRIVATE_KEY, provider)
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer)

export const blockchainEvents = new EventEmitter()

async function processEvent(eventName: string, handler: (...args: any[]) => void, fromBlock: number = 0) {
    const pastEvents = await contract.queryFilter(eventName, fromBlock, "latest")
    for (const e of pastEvents) {
        if ("args" in e && e.args) {
            handler(...(e as EventLog).args)
        }
    }
    contract.on(eventName, (...args: any[]) => {
        handler(...args)
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function startBlockchainListeners(contractInstance: Contract) {
    const deployBlock = 0

    await processEvent(
        "GroupCreated",
        (groupId) => {
            const idStr = groupId.toString()
            saveGroupId(idStr)
            blockchainEvents.emit("GroupCreated", idStr)
        },
        deployBlock
    )

    const members = await loadMembers()

    await processEvent(
        "MemberAdded",
        (groupId, index, identityCommitment) => {
            // eslint-disable-next-line no-console
            console.log(`\nMemberAdded: groupId=${groupId} identityCommitment=${identityCommitment}`)
            addMember(members, groupId.toString(), identityCommitment.toString())
            saveMembers(members)
            blockchainEvents.emit("MemberAddedProcessed", groupId.toString(), identityCommitment.toString())
        },
        deployBlock
    )

    await processEvent(
        "MembersAdded",
        (groupId, startIndex, identityCommitments) => {
            // eslint-disable-next-line no-console
            console.log(`\nBatch members added to group ${groupId}`)
            identityCommitments.forEach((commitment: bigint) => {
                addMember(members, groupId.toString(), commitment.toString())
            })
            saveMembers(members)
        },
        deployBlock
    )

    await processEvent(
        "MemberRemoved",
        (groupId, index, identityCommitment) => {
            // eslint-disable-next-line no-console
            console.log(`\nMemberRemoved: groupId=${groupId} identityCommitment=${identityCommitment}`)
            removeMember(members, groupId.toString(), identityCommitment.toString())
            saveMembers(members)
            blockchainEvents.emit("MemberRemovedProcessed", groupId.toString(), identityCommitment.toString())
        },
        deployBlock
    )

    await processEvent(
        "MemberUpdated",
        (groupId, index, oldIdentityCommitment, newIdentityCommitment) => {
            // eslint-disable-next-line no-console
            console.log(`\nMemberUpdated: groupId=${groupId} old=${oldIdentityCommitment} new=${newIdentityCommitment}`)
            updateMember(
                members,
                groupId.toString(),
                oldIdentityCommitment.toString(),
                newIdentityCommitment.toString()
            )
            saveMembers(members)
            blockchainEvents.emit("MemberUpdatedProcessed", groupId.toString(), newIdentityCommitment.toString())
        },
        deployBlock
    )
}

// eslint-disable-next-line no-console
console.log("\nListening to MemberUpdates...")
;(async () => {
    await startBlockchainListeners(contract)
})()

export async function isAlreadyMember(groupId: string, commitment: bigint): Promise<boolean> {
    try {
        const result: boolean = await contract.hasMember(groupId, commitment)
        return result
    } catch (error) {
        console.error(`Error verifying member:`, error)
        throw error
    }
}
