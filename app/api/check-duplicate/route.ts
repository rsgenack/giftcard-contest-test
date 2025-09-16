import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

interface ContestEntry {
  id: string
  giftCardChoice: "sephora" | "chipotle"
  venmoUsername: string
  timestamp: string
  userAgent?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { venmoUsername } = body

    if (!venmoUsername) {
      return NextResponse.json({ error: "Missing venmo username" }, { status: 400 })
    }

    const normalizedUsername = venmoUsername.trim().replace(/^@/, "").toLowerCase()

    if (!normalizedUsername) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 })
    }

    // Check if username already exists in permanent storage
    const filePath = path.join(process.cwd(), "data", "contest-entries.json")

    if (existsSync(filePath)) {
      try {
        const existingData = await readFile(filePath, "utf-8")
        const entries: ContestEntry[] = JSON.parse(existingData)

        // Check if normalized username already exists
        const isDuplicate = entries.some(
          (entry) => entry.venmoUsername.trim().replace(/^@/, "").toLowerCase() === normalizedUsername,
        )

        return NextResponse.json({ isDuplicate, normalizedUsername })
      } catch (error) {
        console.error("Error reading entries file:", error)
        return NextResponse.json({ isDuplicate: false, normalizedUsername })
      }
    }

    // File doesn't exist yet, no duplicates possible
    return NextResponse.json({ isDuplicate: false, normalizedUsername })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
