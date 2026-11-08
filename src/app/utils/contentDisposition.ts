// ASCII-safe fallback name plus the full name in RFC 5987 `filename*`.
export function attachmentDisposition(fileName: string): string {
  const cleaned = fileName.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  const fallback =
    cleaned.replace(/[^A-Za-z0-9._ -]/g, "_").slice(0, 150) || "download";
  const encoded = encodeURIComponent(cleaned || "download");
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
