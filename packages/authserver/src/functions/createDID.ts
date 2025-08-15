import { Resolver } from "did-resolver"
import { getResolver as keyResolver } from "key-did-resolver"
import { createIssuerDID, issueVC } from "../issuer"
import { createHolderDID, saveVC, verifyVC } from "../holder"

// const PORT = process.env.PORT || 3333
// const SERVER_URL = `http://localhost:${PORT}`

async function main() {
    // eslint-disable-next-line no-console
    console.log("\n\n\n1. Creating the DID Resolver")
    const resolver = new Resolver({
        ...keyResolver()
    })

    // eslint-disable-next-line no-console
    console.log("\n2. Creation of the Issuer's DID document")
    const issuer = await createIssuerDID()

    // eslint-disable-next-line no-console
    console.log("\n3. Creation of the Holder (server) DID document")
    const holderDidInstance = await createHolderDID()
    const holderDid = holderDidInstance.did

    // eslint-disable-next-line no-console
    console.log("\n4. Preparing server information")
    const serverInfo = {
        serial: "70T7S00C00P1234567",
        mac: "00-1A-2B-3C-4D-5E"
    }

    // eslint-disable-next-line no-console
    console.log("\n5. Issuance of the VC (Verifiable Credential by Issuer)")
    const vcJwt = await issueVC(issuer, holderDid, serverInfo)
    // eslint-disable-next-line no-console
    console.log("\nVC JWT issued\n")

    // eslint-disable-next-line no-console
    console.log("\n6. Holder-side VC verification")
    const holderVerifiedVC = await verifyVC(vcJwt, resolver)
    // eslint-disable-next-line no-console
    console.log("\nVC verified :\n", holderVerifiedVC, "\n")

    // eslint-disable-next-line no-console
    console.log("\n7. Backup of the VC")
    await saveVC(vcJwt)
    // eslint-disable-next-line no-console
    console.log("\nVC JWT saved in a json file\n")
}

main().catch(console.error)
