import fs from "fs/promises"
import path from "path"

const STORAGE_DIR = path.join(__dirname, "../storage/VCs")

async function ensureDir(dir: string) {
    try {
        await fs.mkdir(dir, { recursive: true })
    } catch (error) {
        console.warn(`\nFailed to create directory : ${dir}`, error)
    }
}

export async function saveJSON(filename: string, data: any) {
    await ensureDir(STORAGE_DIR)
    const filepath = path.join(STORAGE_DIR, filename)
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8")
}

export async function loadJSON<T>(filename: string): Promise<T | null> {
    const filepath = path.join(STORAGE_DIR, filename)
    try {
        const content = await fs.readFile(filepath, "utf-8")
        return JSON.parse(content) as T
    } catch (error) {
        console.warn(`\nFailed to load JSON from ${filename}:`, error)
        return null
    }
}

export function makeVCFilename(serialNumber: string, macAddress: string): string {
    const safeSerial = serialNumber.replace(/[^a-zA-Z0-9_-]/g, "_")
    const safeMac = macAddress.replace(/[^a-zA-Z0-9_-]/g, "_")
    return `vc_${safeSerial}-${safeMac}.json`
}
