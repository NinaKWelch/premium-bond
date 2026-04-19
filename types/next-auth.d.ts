import 'next-auth';

declare module 'next-auth' {
  interface User {
    backendToken: string;
  }

  interface Session {
    backendToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken: string;
  }
}
