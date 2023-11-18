// import { useSession } from "next-auth/react";
import Head from "next/head";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import LoginForm from "./user/LoginForm";

const Layout = ({ children }: { children: React.ReactNode }) => {
  //   const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Cocktail</title>
        <meta
          name="description"
          content="다양한 칵테일 종류를 확인하고, 취향에 맞는 칵테일을 추천 받을 수 있는 앱"
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, user-scalable=yes"
        />
      </Head>
      <div>{children}</div>
      {/* {status === "authenticated" ? (
        <>
          <Navbar />
          <div className="bg-center bg-fixed bg-cover w-full overflow-x-hidden">
            {children}
          </div>
          <Footer />
        </>
      ) : (
        <LoginForm />
      )} */}
    </>
  );
};

export default Layout;
