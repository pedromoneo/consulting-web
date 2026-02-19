
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    // 1. Authenticate Request
    const apiKey = req.headers.get("x-api-key");
    const secretKey = process.env.CMS_API_KEY;

    if (!secretKey) {
        return NextResponse.json(
            { error: "Server misconfiguration: CMS_API_KEY not set" },
            { status: 500 }
        );
    }

    if (apiKey !== secretKey) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        const { type, data } = body;

        // 2. Validate Input
        if (!type || !["ideas", "cases", "tools"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid content type. Must be one of: ideas, cases, tools" },
                { status: 400 }
            );
        }

        if (!data || typeof data !== "object") {
            return NextResponse.json(
                { error: "Missing or invalid 'data' payload" },
                { status: 400 }
            );
        }

        // 3. Prepare Data
        const timestamp = new Date();
        const docData = {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: data.status || "published", // Default to published if not specified
        };

        // 4. Write to Firestore
        const docRef = await adminDb.collection(type).add(docData);

        return NextResponse.json(
            {
                success: true,
                id: docRef.id,
                message: `Successfully published ${type} post`
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating content:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
