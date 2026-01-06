"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getEmailVerify } from "@/utils/ApiRoutes";

export default function Home({ params }) {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    checkForVerify();
  }, []);

  const checkForVerify = async () => {
    const { data } = await axios.post(getEmailVerify, {
      id: params.id,
      token,
    });
    if (data.status) {
      setLoading(false);
      setStatus("success");
    } else {
      setLoading(false);
      setStatus("failed");
    }
  };

  if (loading) {
    return (
      <main className="h-screen w-full flex items-center	justify-center">
        <div className="loader2">
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full">
      <div className="flex flex-col max-w-2xl mx-auto text-center items-center justify-center min-h-screen">
        {status === "success" ? (
          <>
            <h1 className="text-3xl font-semibold text-green-600">
              Verification Successful
            </h1>
            <p className="mt-4 text-gray-600">
              Your account has been successfully verified.Your request to create
              an account has been submitted, and our team will contact you soon.
              Your credentials will be sent to your email shortly. Thank you!
            </p>
            <a
              onClick={() => {
                router.push("/");
              }}
              className="mt-5 text-sky-500 cursor-pointer"
            >
              Go to home &#8594;
            </a>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-red-600">
              Verification Failed
            </h1>
            <p className="mt-4 text-gray-600">
              We couldn&apos;t verify your account. Please contact our support
              team for assistance.
            </p>
            <a
              onClick={() => {
                router.push("/");
              }}
              className="mt-5 text-sky-500 cursor-pointer"
            >
              Go to home &#8594;
            </a>
          </>
        )}
      </div>
    </main>
  );
}
