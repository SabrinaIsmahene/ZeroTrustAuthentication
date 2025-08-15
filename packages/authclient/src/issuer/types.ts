import type { Issuer as issuer } from "did-jwt-vc"

export interface DeviceInfo {
    serial: string
    mac: string
}

export type Issuer = issuer
