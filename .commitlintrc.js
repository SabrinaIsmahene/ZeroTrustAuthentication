const fs = require("node:fs")
const path = require("node:path")

const packages = fs.readdirSync(path.resolve(__dirname, "packages"))
const appsDir = path.resolve(__dirname, "apps")
const apps = fs.existsSync(appsDir) ? fs.readdirSync(appsDir) : []

module.exports = {
    extends: ["@commitlint/config-conventional"],
    prompt: {
        scopes: [...packages, ...apps],
        markBreakingChangeMode: true,
        allowCustomIssuePrefix: false,
        allowEmptyIssuePrefix: false,
        issuePrefixes: [
            {
                value: "re",
                name: "re: ISSUES related"
            }
        ]
    }
}
