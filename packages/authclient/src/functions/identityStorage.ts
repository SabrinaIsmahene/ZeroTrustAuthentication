import fs from "fs"
import path from "path"
import { Identity } from "@semaphore-protocol/identity"

const IDENTITIES_DIR = path.join(__dirname, "../storage/identities")

export function saveIdentity(identity: Identity, filename: string) {
    if (!fs.existsSync(IDENTITIES_DIR)) {
        fs.mkdirSync(IDENTITIES_DIR, { recursive: true })
    }

    const json = {
        privateKey: identity.privateKey.toString("hex"),
        secretScalar: identity.secretScalar.toString(),
        publicKey: identity.publicKey.map((p) => p.toString()),
        commitment: identity.commitment.toString()
    }

    const filePath = path.join(IDENTITIES_DIR, `${filename}.json`)
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
    // eslint-disable-next-line no-console
    console.log(`\nIdentity saved at ${filePath}`)
}

export function loadIdentity(filename: string): Identity {
    const filePath = path.join(IDENTITIES_DIR, `${filename}.json`)

    if (!fs.existsSync(filePath)) {
        throw new Error(`Identity file not found : ${filePath}`)
    }

    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    if (!json.privateKey) {
        throw new Error("Invalid identity file : missing privateKey (secret value)")
    }

    const identity = new Identity(Buffer.from(json.privateKey, "hex"))

    return identity
}
