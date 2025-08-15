import fs from "fs"
import path from "path"

const nullifiersFolder = path.resolve(__dirname, "../storage/nullifiers")

if (!fs.existsSync(nullifiersFolder)) {
    fs.mkdirSync(nullifiersFolder, { recursive: true })
}

function getNullifierFilePath(nullifierName: string): string {
    const filename = `${nullifierName}.json`
    return path.join(nullifiersFolder, filename)
}

export function loadNullifiers(nullifierName: string): Set<string> {
    const filePath = getNullifierFilePath(nullifierName)

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = fs.readFileSync(filePath, "utf-8")
    const list = JSON.parse(data)
    return new Set(list)
}

export function saveNullifier(nullifierName: string, nullifier: string): void {
    const nullifiers = loadNullifiers(nullifierName)
    nullifiers.add(nullifier)
    const filePath = getNullifierFilePath(nullifierName)
    fs.writeFileSync(filePath, JSON.stringify(Array.from(nullifiers), null, 2))
}

export function isNullifierUsed(nullifierName: string, nullifier: string): boolean {
    const nullifiers = loadNullifiers(nullifierName)
    return nullifiers.has(nullifier)
}
