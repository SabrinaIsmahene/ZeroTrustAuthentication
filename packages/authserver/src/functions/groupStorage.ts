import fs from "fs"
import path from "path"

const groupDirPath = path.join(__dirname, "../storage/group")

const membersFilePath = path.join(groupDirPath, "members.json")

type Members = { [groupId: string]: string[] }

export async function loadMembers(): Promise<Members> {
    if (!fs.existsSync(groupDirPath)) {
        fs.mkdirSync(groupDirPath, { recursive: true })
    }

    if (!fs.existsSync(membersFilePath)) {
        fs.writeFileSync(membersFilePath, JSON.stringify({}, null, 2), "utf-8")
        return {}
    }
    const data = fs.readFileSync(membersFilePath, "utf-8")
    // console.log("\nReading the file :", new Date().toISOString())

    return JSON.parse(data)
}

export function saveMembers(members: Members) {
    if (!fs.existsSync(groupDirPath)) {
        fs.mkdirSync(groupDirPath, { recursive: true })
    }

    if (!fs.existsSync(membersFilePath)) {
        fs.writeFileSync(membersFilePath, JSON.stringify({}, null, 2), "utf-8")
    }

    fs.writeFileSync(membersFilePath, JSON.stringify(members, null, 2), "utf-8")
    // console.log("\nWriting in the file :", new Date().toISOString())
}

export function addMember(members: Members, groupId: string, identityCommitment: string) {
    if (!members[groupId]) members[groupId] = []
    if (!members[groupId].includes(identityCommitment)) {
        members[groupId].push(identityCommitment)
    }
}

export function removeMember(members: Members, groupId: string, identityCommitment: string) {
    if (!members[groupId]) return
    members[groupId] = members[groupId].filter((id) => id !== identityCommitment)
}

export function updateMember(
    members: Members,
    groupId: string,
    oldIdentityCommitment: string,
    newIdentityCommitment: string
) {
    if (!members[groupId]) return
    const index = members[groupId].indexOf(oldIdentityCommitment)
    if (index !== -1) {
        members[groupId][index] = newIdentityCommitment
    }
}

const groupsFile = path.join(groupDirPath, "IDs.json")

export function saveGroupId(groupId: string) {
    if (!fs.existsSync(groupDirPath)) {
        fs.mkdirSync(groupDirPath, { recursive: true })
    }

    let groupIds: string[] = []
    if (fs.existsSync(groupsFile)) {
        try {
            const data = JSON.parse(fs.readFileSync(groupsFile, "utf-8"))
            if (Array.isArray(data)) {
                groupIds = data
            } else {
                console.warn("Invalid content in groupsFile. Overwriting with an empty array.")
            }
        } catch (e) {
            console.error("Error parsing groupsFile:", e)
        }
    }

    if (!groupIds.includes(groupId)) {
        groupIds.push(groupId)
        fs.writeFileSync(groupsFile, JSON.stringify(groupIds, null, 2))
    }
}

export function getAllGroupIds(): string[] {
    if (!fs.existsSync(groupDirPath)) {
        fs.mkdirSync(groupDirPath, { recursive: true })
    }

    if (!fs.existsSync(groupsFile)) {
        fs.writeFileSync(groupsFile, JSON.stringify([], null, 2), "utf-8")
        return []
    }

    return JSON.parse(fs.readFileSync(groupsFile, "utf-8"))
}
