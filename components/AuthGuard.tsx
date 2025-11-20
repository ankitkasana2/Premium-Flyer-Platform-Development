"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Amplify } from "aws-amplify";

const Authenticator = dynamic(
  () => import("@aws-amplify/ui-react").then((m) => m.Authenticator),
  { ssr: false }
);

import "@aws-amplify/ui-react/styles.css";

export default function AuthGuard({ children }: any) {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: "ap-southeast-2_1tWWnrkxi",
          userPoolClientId: "2rrjp79uvfvje1ip5c70c4e1gk",
          region: "ap-southeast-2",
        },
      },
    });
  }, []);

  return (
    <Authenticator>
      {() => children}
    </Authenticator>
  );
}
