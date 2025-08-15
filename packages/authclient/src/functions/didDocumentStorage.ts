import fs from "fs/promises"
import fsSync from "fs"
import path from "path"
import { Resolver } from "did-resolver"

const DID_DOCS_DIR = path.join(__dirname, "../storage/didDocuments")

function safeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

export async function createAndSaveDIDDocument(
    didResolver: Resolver,
    didUrl: string,
    typeDid: "holder" | "issuer"
): Promise<void> {
    const { didDocument } = await didResolver.resolve(didUrl)
    const did = didDocument?.id

    if (!did || !didDocument) {
        throw new Error("DID Document or ID not found.")
    }

    if (!fsSync.existsSync(DID_DOCS_DIR)) {
        await fs.mkdir(DID_DOCS_DIR, { recursive: true })
    }

    const parts = did.split(":")
    const didSuffix = parts[parts.length - 1] || "unknown"

    const filename = `didkey_${typeDid}_${safeFilename(didSuffix)}.json`
    const filepath = path.join(DID_DOCS_DIR, filename)

    await fs.writeFile(filepath, JSON.stringify(didDocument, null, 2), "utf-8")
    // eslint-disable-next-line no-console
    console.log(`\nDID Document for ${did} saved in file ${filepath}`)
}
