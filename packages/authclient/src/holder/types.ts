export interface DeviceInfo {
    serial: string
    mac: string
}

export interface VerifiedVC {
    serial: string
    mac: string
    holderDid: string
    vcJwt: string
}
