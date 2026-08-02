const GEMINI_HOST = "generativelanguage.googleapis.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        JSON.stringify([{ status: "ok",code: 200, message: "Proxy is OK", target: GEMINI_HOST},{ by: "Zhouyi2013", github: "github.com/ZhouyiStudio" }]),
        {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    const targetUrl = new URL(request.url);
    targetUrl.protocol = "https:";
    targetUrl.hostname = GEMINI_HOST;
    targetUrl.port = "";

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ipcountry");
    headers.delete("cf-ray");
    headers.delete("cf-visitor");
    headers.delete("x-forwarded-for");
    headers.delete("x-forwarded-proto");

    const init = {
      method: request.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    };

    try {
      const resp = await fetch(targetUrl.toString(), init);
      const respHeaders = new Headers(resp.headers);
      respHeaders.set("Access-Control-Allow-Origin", "*");
      respHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      respHeaders.set("Access-Control-Allow-Headers", "*");

      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: respHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Proxy request failed", detail: String(err) }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
