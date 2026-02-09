"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { connect, jwtAuthenticator, StringCodec } from "nats.ws";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
import applestore from "/public/images/logo/appstore.png";
import googleplay from "/public/images/logo/googleplay.png";
import { useRouter } from "next/navigation";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import api from "@/lib/axios";

export default function NDILogin() {
  const [proofRequestURL, setProofRequestURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [os, setOs] = useState('');

  const router = useRouter();

  const sendToServer = useCallback(
    async (params: { username: string; name: string }) => {
      try {
        api.post(`auth/ndi-login/`, {
          cid: params.username,
          name: params.name,
        }).then((response) => {
          const data = response.data;

          const token = data.data.access;
          if (token) {
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1}; samesite=Lax;`;
            localStorage.setItem("crm_token", token);
            localStorage.setItem("userDetails", JSON.stringify(data.data.user));
            setTimeout(() => router.push("/dashboard"), 1500);
          } else {
            toast.error("Your details is not registered.")
          }

        })

      } catch (err) {
        setErrorMessage("Failed to process login.");
      }
    },
    [router]
  );

  const natsListener = useCallback(
    async (threadId: string) => {
      try {
        const conn = await connect({
          servers: ["wss://natsg2c-client.bhutanndi.com"],
          // servers: ["wss://natsdemoclient.bhutanndi.com"],
          authenticator: jwtAuthenticator(
            "",
            new TextEncoder().encode('SUAOCNCDWVZGDKIT63PAJVGCK5O6GMBMEJG3S52LZZILDNP4LTVPNN5FPE')
            // new TextEncoder().encode('SUAPXY7TJFUFE3IX3OEMSLE3JFZJ3FZZRSRSOGSG2ANDIFN77O2MIBHWUM')
          ),
        });

        const sc = StringCodec();
        const sub = conn.subscribe(threadId);

        for await (const m of sub) {
          const data = JSON.parse(sc.decode(m.data));
          console.log(data?.data?.verification_result)
          if (data?.data?.verification_result === "ProofValidated") {
            const attrs = data.data.requested_presentation.revealed_attrs;
            const cid = attrs["ID Number"]?.[0]?.value;
            const fullName = attrs["Full Name"]?.[0]?.value;

            if (cid && fullName) {
              await sendToServer({ username: cid, name: fullName });
            } else {
              setErrorMessage("Missing required identity data.");
            }
            conn.close();
            break;
          } else {
            setErrorMessage("Authorization denied or failed.");
          }
        }
      } catch (err) {
        console.error("NATS Error:", err);
        setErrorMessage("Connection failed. Try again.");
      }
    },
    [sendToServer]
  );

  const detectDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iPhone/iOS";
    return "Other";
  };

  const initiateNDILogin = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/ndi/`);
      const { proofRequestURL, proofRequestThreadId, deepLinkURL } = res.data.data;
      setProofRequestURL(proofRequestURL);
      natsListener(proofRequestThreadId);
      setDeepLinkUrl(deepLinkURL);
    } catch {
      setErrorMessage("Unable to connect to Bhutan NDI service.");
    } finally {
      setIsLoading(false);
    }
  }, [natsListener]);

  useEffect(() => {
    setOs(detectDeviceType());
    initiateNDILogin();
  }, [initiateNDILogin]);

  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 mx-auto min-h-screen">
      <div className="absolute top-6 left-6 z-10">
        <a
          href="/signin"
          className="bg-white text-[#5AC994] border-2 border-[#5AC994] rounded-full px-5 py-2 text-sm font-semibold hover:bg-[#5AC994] hover:text-white transition-colors shadow-md inline-flex items-center"
        >
          ← Back to Sign In
        </a>
      </div>

      <div
        className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg shadow-md w-full max-w-[590px] text-center p-8"

      >
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="text-center mb-7">
          <span className="font-bold text-[#000000] block">
            {os !== "Other" ? "Login" : "Scan"} with{" "}
            <span className="text-[#5AC994]">Bhutan NDI</span> Wallet
          </span>
        </div>

        {os !== "Other" && (
          <>
            <div className="flex flex-col items-center justify-center pl-6 pr-6 mb-7">
              <a
                href={deepLinkUrl}
                className="w-full mx-6 bg-[#5AC994] text-white font-bold text-center rounded-lg px-6 py-3.5 no-underline shadow-md hover:bg-[#4eb883] transition-colors"
              >
                Open Bhutan NDI Wallet
              </a>
            </div>

            <div className="relative flex items-center justify-center w-full mb-7">
              <div className="absolute inset-0 flex items-center pl-6 pr-6">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-[#F8F8F8] px-4 font-medium text-[#A1A0A0]">OR</span>
            </div>
          </>
        )}

        <div className="flex justify-center mb-7">
          <div className="border-[3px] border-[#5AC994] p-3 rounded-2xl bg-white">
            {proofRequestURL ? (
              <QRCodeSVG
                value={proofRequestURL}
                size={200}
                level="H"
                imageSettings={{
                  src: "/images/logo/NDIlogobg.png",
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            ) : (
              <div className={`w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded ${!isLoading && 'text-red-500'}`}>
                {isLoading ? "Loading..." : errorMessage}
              </div>
            )}
          </div>

        </div>


        <div className="text-left max-w-md mx-auto pl-10 pr-10 mb-7">
          {errorMessage &&

            <div className="items-center py-2 pl-8 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800">
              {errorMessage}
            </div>
          }
          <ol className="custom-indent space-y-1 text-[#A1A0A0] font-medium">
            <li>Open Bhutan NDI Wallet on your phone</li>
            <li>
              Tap the Scan button {" "}
              <span className="bg-[#5AC994] text-white rounded-full p-1 inline-flex items-center">
                <BiQrScan size={14} />
              </span>{" "}
              located on the menu bar and scan the QR code
            </li>
          </ol>
        </div>

        <div className="flex justify-center mb-7">
          <a
            href="https://www.youtube.com/@BhutanNDI"
            target="_blank"
            rel="noreferrer"
            className="border-2 border-[#5AC994] text-[#5AC994] hover:bg-[#5AC994] hover:text-white transition-colors duration-200 rounded-full px-6 py-2 flex items-center space-x-2 font-medium text-sm"
          >
            <span>Watch video guide</span>
            <BiPlayCircle size={20} />
          </a>
        </div>

        <div className="mb-7">
          <p className="text-[#A1A0A0] text-sm">
            Don’t have the Bhutan NDI Wallet?{" "}
            {os !== "Other" && <br />}
            <a
              href="https://kiwhp.app.link/?t="
              target="_blank"
              rel="noreferrer"
              className="text-[#5AC994] font-semibold"
            >
              Download Now!
            </a>
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-7">
          <a
            href="https://play.google.com/store/apps/details?id=com.bhutanndi&hl=en_IN&gl=US"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={googleplay} alt="Google Play" width={150} height={50} />
          </a>
          <a
            href="https://apps.apple.com/bt/app/bhutan-ndi/id1645493166"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={applestore} alt="App Store" width={150} height={50} />
          </a>
        </div>

        <div className="mt-6 text-center mb-7">
          <div className="text-center mb-7">
            <span className="font-bold text-[#5AC994] block">
              Get Support
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 font-semibold">
              <IoIosMail size={20} className="text-[#5AC994]" />
              <a href="mailto:ndifeedback@dhi.bt" className="underline-offset-2 text-sm">
                ndifeedback@dhi.bt
              </a>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <FaPhoneVolume size={16} className="text-[#5AC994]" />
              <a href="tel:1199" className="underline-offset-2 text-sm">
                1199
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
