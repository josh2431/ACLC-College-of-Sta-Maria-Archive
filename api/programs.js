const fs = require("node:fs/promises");
const path = require("node:path");

const allowedReferrerPaths = new Set(["/", "/index.html", "/programs.html"]);

module.exports = async function handler(request, response) {
    response.setHeader("Cache-Control", "private, no-store, max-age=0");
    response.setHeader("Vary", "Referer");

    if (request.method !== "GET" && request.method !== "HEAD") {
        response.setHeader("Allow", "GET, HEAD");
        response.status(405).end();
        return;
    }

    const host = request.headers.host;
    const referrer = request.headers.referer;
    let isAllowed = false;

    if (host && referrer) {
        try {
            const referrerUrl = new URL(referrer);
            isAllowed =
                referrerUrl.host === host.toLowerCase() &&
                allowedReferrerPaths.has(referrerUrl.pathname);
        } catch {
            isAllowed = false;
        }
    }

    if (!isAllowed) {
        response.statusCode = 302;
        response.setHeader("Location", "/index.html");
        response.end();
        return;
    }

    try {
        const html = await fs.readFile(path.join(process.cwd(), "programs.html"));
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.statusCode = 200;
        response.end(request.method === "HEAD" ? undefined : html);
    } catch (error) {
        console.error("Unable to read programs.html for the Vercel route.", error);
        response.statusCode = 500;
        response.end("Unable to load the program index.");
    }
};
