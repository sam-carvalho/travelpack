export { default } from "next-auth/middleware";

// This middleware will protect the /dashboard route
// and redirect unauthenticated users to the sign-in page.
export const config = { matcher: ["/dashboard"] };
