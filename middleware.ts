export { default } from "next-auth/middleware";

// This middleware will protect the /trips route
// and redirect unauthenticated users to the sign-in page.
export const config = { matcher: ["/trips", "/trips/:path*"] };
