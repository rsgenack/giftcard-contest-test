import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const ENTRIES_FILE = path.join(process.cwd(), "data", "submitted-usernames.json")

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function getSubmittedUsernames(): Promise<string[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ENTRIES_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function addSubmittedUsername(username: string) {
  const usernames = await getSubmittedUsernames()
  if (!usernames.includes(username.toLowerCase())) {
    usernames.push(username.toLowerCase())
    await ensureDataDir()
    await fs.writeFile(ENTRIES_FILE, JSON.stringify(usernames, null, 2))
  }
}

export async function POST(request: NextRequest) {
  try {
    const { venmoUsername, action } = await request.json()

    if (!venmoUsername) {
      return NextResponse.json({ error: "Venmo username is required" }, { status: 400 })
    }

    const normalizedUsername = venmoUsername.toLowerCase().replace("@", "")

    if (action === "check") {
      const submittedUsernames = await getSubmittedUsernames()
      const alreadySubmitted = submittedUsernames.includes(normalizedUsername)
      return NextResponse.json({ alreadySubmitted })
    }

    if (action === "submit") {
      const submittedUsernames = await getSubmittedUsernames()
      const alreadySubmitted = submittedUsernames.includes(normalizedUsername)

      if (alreadySubmitted) {
        return NextResponse.json(
          { error: "This Venmo username has already been used to submit an entry" },
          { status: 409 },
        )
      }

      await addSubmittedUsername(normalizedUsername)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in check-entry API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
