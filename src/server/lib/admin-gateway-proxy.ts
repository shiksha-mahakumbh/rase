import type { NextRequest } from "next/server";
import { signAdminGatewayContext } from "@/server/lib/admin-gateway-context";
import type { AdminSessionPayload } from "@/server/lib/supabase-admin-auth";

/** Build signed headers for internal v2 admin proxy calls. */
export function adminGatewayProxyHeaders(session: AdminSessionPayload): Headers {
  const secret = process.env.ADMIN_OPS_SECRET;
  if (!secret) {
    throw new Error("ADMIN_OPS_SECRET is not configured");
  }

  const headers = new Headers();
  headers.set("x-ops-secret", secret);
  headers.set("x-admin-role", session.role);
  headers.set("x-admin-email", session.email);
  headers.set("x-admin-uid", session.uid);
  headers.set(
    "x-admin-context-sig",
    signAdminGatewayContext(session.email, session.role, session.uid)
  );
  return headers;
}

export async function proxyToV2Admin(
  request: NextRequest,
  session: AdminSessionPayload,
  segments: string[]
): Promise<Response> {
  const incoming = new URL(request.url);
  const targetPath = `/api/v2/admin/${segments.join("/")}`;
  const targetUrl = new URL(targetPath, incoming.origin);
  targetUrl.search = incoming.search;

  const headers = adminGatewayProxyHeaders(session);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  return fetch(targetUrl.toString(), {
    method,
    headers,
    body: body?.byteLength ? body : undefined,
    cache: "no-store",
  });
}
