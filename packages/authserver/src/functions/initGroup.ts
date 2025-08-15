import { createGroup } from "./contract"
import { getAllGroupIds } from "./groupStorage"

export const state = {
    serverGroupId: null as string | null
}

export async function initGroup() {
    const groups = getAllGroupIds()

    if (groups.length === 0) {
        try {
            await createGroup()
            // eslint-disable-next-line no-console
            console.log(`Initial group created.`)
            return "created"
        } catch (e) {
            console.error("Error creating initial group :", e)
            process.exit(1)
            return "error"
        }
    } else {
        ;[state.serverGroupId] = groups // We keep the first existing group
        // eslint-disable-next-line no-console
        console.log(`Existing group with Id : ${state.serverGroupId}, will be used `)
        return "existing"
    }
}
