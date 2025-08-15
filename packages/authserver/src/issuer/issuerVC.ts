import { createVerifiableCredentialJwt } from "did-jwt-vc"
import type { ServerInfo, Issuer } from "./types"

export async function issueVC(issuer: Issuer, holderDid: string, serverInfo: ServerInfo): Promise<string> {
    const payload = {
        sub: holderDid,
        nbf: Math.floor(Date.now() / 1000),
        vc: {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            type: ["VerifiableCredential", "DeviceCredential"],
            credentialSubject: {
                id: holderDid,
                serial: serverInfo.serial,
                mac: serverInfo.mac
            }
        }
    }

    return createVerifiableCredentialJwt(payload, issuer)
}
