import { randomBytes } from "@noble/hashes/utils"
import { DID } from "dids"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { getResolver as keyResolver } from "key-did-resolver"
import { EdDSASigner } from "did-jwt"
import { Resolver } from "did-resolver"
import { createAndSaveDIDDocument } from "../functions/didDocumentStorage"

type SigneFn = (data: string | Uint8Array) => Promise<string>

export async function createHolderDID(): Promise<{
    did: string
    signer: SigneFn
    alg: string
    didInstance: DID
}> {
    const seed = randomBytes(32)
    const provider = new Ed25519Provider(seed)
    const didInstance = new DID({
        provider,
        resolver: keyResolver()
    })

    await didInstance.authenticate()

    const resolver = new Resolver({ ...keyResolver() })
    await createAndSaveDIDDocument(resolver, didInstance.id, "holder")

    const rawSigner = EdDSASigner(seed)
    const signer: SigneFn = async (data) => {
        const result = await rawSigner(data)
        if (typeof result !== "string") {
            throw new Error("Signer returnes non-string signature")
        }
        return result
    }

    return {
        did: didInstance.id,
        signer,
        alg: "EdDSA",
        didInstance
    }
}
