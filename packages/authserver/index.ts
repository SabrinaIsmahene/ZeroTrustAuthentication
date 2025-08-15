import { verifyProof } from "@semaphore-protocol/proof"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import { isNullifierUsed, saveNullifier } from "./src/functions/nullifierStorage"
import { addMemberToGroup } from "./src/functions/contract"
import { initGroup } from "./src/functions/initGroup"

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

dotenv.config()

// create a group
initGroup()

app.post("/add-member", async (req, res) => {
    const { groupId } = req.body
    const identityCommitment = BigInt(req.body.identityCommitment)
    if (!groupId) {
        return res.status(400).json({ error: "groupId required" })
    }
    if (!identityCommitment) {
        return res.status(400).json({ error: "IdentityCommitment required" })
    }
    try {
        await addMemberToGroup(groupId, identityCommitment)
        return res.json({ success: true })
    } catch (e: unknown) {
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message })
        }
        return res.status(500).json({ error: "An unknown error has occurred" })
    }
})

app.post("/group/:groupId/join-proof", async (req, res) => {
    const { groupId } = req.params
    const { commitment, proof, nullifier, scope } = req.body

    if (!commitment || !proof || !nullifier || !scope) {
        return res.status(400).send("Missing parameters")
    }

    try {
        const verified = await verifyProof(proof)
        if (!verified) {
            return res.status(400).send("Invalid Join Proof")
        }
        // eslint-disable-next-line no-console
        console.log(`\nJoin Proof in group "${groupId}" valid `)
        return res.sendStatus(200)
    } catch (err) {
        return res.status(500).send("Server error")
    }
})

app.post("/group/:groupId/modtrain-proof", async (req, res) => {
    const { groupId } = req.params
    const { fullProof, nullifier, message, scope } = req.body

    if (!fullProof || !nullifier || !message || !scope) {
        return res.status(400).send("Missing parameters")
    }

    const nullifierName = `${scope}-ModTrain-${nullifier}`

    if (isNullifierUsed(nullifierName, nullifier)) {
        return res.status(400).json({ error: "Error. Nullifier already used (double use)" })
    }

    try {
        const verified = await verifyProof(fullProof)
        if (!verified) {
            return res.status(400).send("Invalid Model Update Proof")
        }

        saveNullifier(nullifierName, nullifier)
        // eslint-disable-next-line no-console
        console.log(`\nModel Update Proof in group "${groupId}" valid`)

        return res.sendStatus(200)
    } catch (err) {
        console.error("Error verifying Model Update Proof :", err)
        return res.status(500).send("Server error")
    }
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`\nServer running on : http://localhost:${PORT}`)
})
