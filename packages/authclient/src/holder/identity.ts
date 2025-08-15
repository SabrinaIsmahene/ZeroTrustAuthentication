import { Identity } from "@semaphore-protocol/identity"
import { createHash } from "crypto"
import type { VerifiedVC } from "./types"
import { loadIdentity, saveIdentity } from "../functions/identityStorage"

export function generateIdentityFromVC(vc: VerifiedVC) {
    const { serial, mac } = vc
    const secret = `${serial}-${mac}`
    const filename = `id_${secret.replace(/[^a-zA-Z0-9_-]/g, "_")}`

    let identity: Identity

    try {
        identity = loadIdentity(filename)
        // eslint-disable-next-line no-console
        console.log(`\nIdentity loaded`)
    } catch (error) {
        const hashedBuffer = createHash("sha256").update(secret).digest()

        identity = new Identity(hashedBuffer)

        saveIdentity(identity, filename)
    }
    return {
        identity,
        commitment: identity.commitment
    }
}
