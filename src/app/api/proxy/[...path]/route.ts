import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

async function safeJson(response: Response) {
    const text = await response.text()
    try {
        return JSON.parse(text)
    } catch (e) {
        return { message: text }
    }
}

function getSession() {
    return auth()
}

function invalidSession(session: any) {
    if (!session) return true
    if ((session as any).error === "RefreshAccessTokenError") return true
    if (!(session as any).accessToken) return true
    return false
}

function buildTargetUrl(req: NextRequest, path: string) {
    const queryString = req.nextUrl.searchParams.toString()
    const base = `${process.env.API_URL}/api/v1/${path}`
    return queryString ? `${base}?${queryString}` : base
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await getSession()
    if (invalidSession(session)) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = buildTargetUrl(req, path)

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "Authorization": `Bearer ${(session as any).accessToken}`
            }
        })
        const data = await safeJson(response)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy GET Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await getSession()
    if (invalidSession(session)) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = buildTargetUrl(req, path)

    let body = {}
    try {
        body = await req.json()
    } catch (e) {}

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
        const data = await safeJson(response)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy POST Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await getSession()
    if (invalidSession(session)) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = buildTargetUrl(req, path)

    let body = {}
    try {
        body = await req.json()
    } catch (e) {}

    try {
        const response = await fetch(targetUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${(session as any).accessToken}`
            },
            body: JSON.stringify(body)
        })
        const data = await safeJson(response)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy PUT Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await getSession()
    if (invalidSession(session)) return NextResponse.json({ error: "No session" }, { status: 401 })

    const resolvedParams = await params
    const path = resolvedParams.path.join("/")
    const targetUrl = buildTargetUrl(req, path)

    try {
        const response = await fetch(targetUrl, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${(session as any).accessToken}`
            }
        })
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 })
        }
        const data = await safeJson(response)
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Proxy DELETE Error:", error)
        return NextResponse.json({ error: "Proxy error" }, { status: 500 })
    }
}