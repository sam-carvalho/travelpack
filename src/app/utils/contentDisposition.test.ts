import { attachmentDisposition } from "./contentDisposition";

describe("attachmentDisposition", () => {
  it("keeps simple names readable", () => {
    expect(attachmentDisposition("Beach trip.pdf")).toBe(
      "attachment; filename=\"Beach trip.pdf\"; filename*=UTF-8''Beach%20trip.pdf",
    );
  });

  it("strips header-breaking characters", () => {
    const header = attachmentDisposition('a"b\r\nSet-Cookie: x=1.pdf');
    expect(header).not.toMatch(/[\r\n]/);
    expect(header.split('"').length).toBe(3);
  });

  it("encodes non-ASCII names in filename*", () => {
    expect(attachmentDisposition("Café.pdf")).toContain(
      "filename*=UTF-8''Caf%C3%A9.pdf",
    );
  });

  it("falls back when the name is empty", () => {
    expect(attachmentDisposition("\n")).toContain('filename="download"');
  });
});
