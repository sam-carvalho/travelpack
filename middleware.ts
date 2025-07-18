import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // The middleware will protect all routes
  // except for public routes such as /signin, /signup, etc.
  function middleware(req) {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }
  },
  {
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/((?!_next|api|signin|signup|public|favicon.ico).*)"],
};
