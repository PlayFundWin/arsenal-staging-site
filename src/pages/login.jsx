import React from "react";

import useDocumentTitle from "../components/useDocumentTitle";
import { Helmet } from "react-helmet";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  useDocumentTitle("Login");
  return (
    <>
      <Helmet>
        <title>Login to Your Hendrix Archive Draw Account | Get Closer to Big Wins</title>
        <meta
          name="description"
          content="Access your account to manage your tickets, view upcoming draws, and keep track of your winnings. Your next big win is just a login away!"
        />
      </Helmet>
      <div className="bg-white" style={{ height: "100vh" }}>
        <LoginForm />
      </div>
    </>
  );
}
