import { createVerifiableCredentialJwt } from "did-jwt-vc"
import type { DeviceInfo, Issuer } from "./types"

export async function issueVC(issuer: Issuer, holderDid: string, deviceInfo: DeviceInfo): Promise<string> {
    const payload = {
        sub: holderDid,
        nbf: Math.floor(Date.now() / 1000),
        vc: {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            type: ["VerifiableCredential", "DeviceCredential"],
            credentialSubject: {
                id: holderDid,
                serial: deviceInfo.serial,
                mac: deviceInfo.mac
            }
        }
    }

    return createVerifiableCredentialJwt(payload, issuer)
}
