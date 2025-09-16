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

async function getEntries(): Promise<ContestEntry[]> {
  const filePath = path.join(process.cwd(), "data", "contest-entries.json")

  if (!existsSync(filePath)) {
    return []
  }

  try {
    const data = await readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading entries:", error)
    return []
  }
}

export default async function AdminPage() {
  const entries = await getEntries()

  const sephoraCount = entries.filter((e) => e.giftCardChoice === "sephora").length
  const chipotleCount = entries.filter((e) => e.giftCardChoice === "chipotle").length

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Contest Entries Admin</h1>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Entries</h3>
          <p className="text-3xl font-bold text-primary">{entries.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Sephora Preference</h3>
          <p className="text-3xl font-bold text-pink-600">{sephoraCount}</p>
          <p className="text-sm text-muted-foreground">
            {entries.length > 0 ? Math.round((sephoraCount / entries.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Chipotle Preference</h3>
          <p className="text-3xl font-bold text-orange-600">{chipotleCount}</p>
          <p className="text-sm text-muted-foreground">
            {entries.length > 0 ? Math.round((chipotleCount / entries.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Timestamp</th>
                <th className="text-left p-4 font-medium">Venmo Username</th>
                <th className="text-left p-4 font-medium">Gift Card Choice</th>
                <th className="text-left p-4 font-medium">Entry ID</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-muted-foreground">
                    No entries yet
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-4">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="p-4 font-mono">{entry.venmoUsername}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.giftCardChoice === "sephora"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {entry.giftCardChoice === "sephora" ? "Sephora" : "Chipotle"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">{entry.id.slice(0, 8)}...</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
