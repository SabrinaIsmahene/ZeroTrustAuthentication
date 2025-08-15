import { verifyCredential } from "did-jwt-vc"
import { type Resolvable } from "did-resolver"
import { decodeJWT } from "did-jwt"
import type { VerifiedVC } from "./types"
import { loadJSON, saveJSON, makeVCFilename } from "../functions/VCsStorage"

export async function loadVC(serial: string, mac: string): Promise<string> {
    const safeSerial = serial.replace(/[^a-zA-Z0-9_-]/g, "_")
    const safeMac = mac.replace(/[^a-zA-Z0-9_-]/g, "_")
    const filename = `vc_${safeSerial}-${safeMac}.json`
    const data = await loadJSON<{ vcJwt: string }>(filename)
    if (!data) throw new Error(`\nVC not found for serial number: ${serial} and mac address: ${mac}`)
    return data.vcJwt
}

export async function verifyVC(vcJwt: string, resolver: Resolvable): Promise<VerifiedVC> {
    const { verifiableCredential: credential } = await verifyCredential(vcJwt, resolver)
    const { credentialSubject } = credential
    const { serial, mac, id: holderDid } = credentialSubject

    if (!holderDid) {
        throw new Error("\nholderDid missing in VC")
    }

    return {
        serial,
        mac,
        holderDid,
        vcJwt
    }
}

export async function saveVC(vcJwt: string): Promise<void> {
    const decoded = decodeJWT(vcJwt)
    const { payload } = decoded as { payload: Record<string, any> }

    const { vc } = payload
    const { credentialSubject } = vc
    const { serial, mac, id: holderDid } = credentialSubject

    const filename = makeVCFilename(serial, mac)

    const structuredVC = {
        serial,
        mac,
        holderDid,
        vcJwt
    }

    await saveJSON(filename, structuredVC)
}
