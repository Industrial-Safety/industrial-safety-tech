import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "No session" }, { status: 401 })

    // Resolvemos el path (ej. ["users"] o ["users", "register"])
    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = `${process.env.API_URL}/api/v1/${path}`

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "Authorization": `Bearer ${(session as any).accessToken}`
            }
        })
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy GET Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = `${process.env.API_URL}/api/v1/${path}`
    const body = await req.json()
    console.log("DEBUG [Proxy POST] Target:", targetUrl);
    console.log("DEBUG [Proxy POST] Body:", body);

    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${(session as any).accessToken}`
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy POST Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = `${process.env.API_URL}/api/v1/${path}`
    const body = await req.json()

    try {
        const response = await fetch(targetUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${(session as any).accessToken}`
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy PUT Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

