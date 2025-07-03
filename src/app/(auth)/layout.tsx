import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      {children}
    </main>
  );
};

export default AuthLayout;
