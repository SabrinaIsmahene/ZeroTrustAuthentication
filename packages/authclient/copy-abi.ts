import * as fs from "fs"
import * as path from "path"

const abiSrcPath: string = path.join(__dirname, "../contracts/artifacts/contracts/Semaphore.sol/Semaphore.json")

const targets: string[] = [path.join(__dirname, "./src/storage/abi")]

function copyABIAndAddress(): void {
    if (!fs.existsSync(abiSrcPath)) {
        console.error("\nABI not found.")
        return
    }

    const abiFile: string = fs.readFileSync(abiSrcPath, "utf-8")

    targets.forEach((targetPath: string) => {
        fs.mkdirSync(targetPath, { recursive: true })
        fs.writeFileSync(path.join(targetPath, "Semaphore.json"), abiFile)
        // console.log(`\nCopied ABI to ${targetPath}`)
    })
}

copyABIAndAddress()
