"use client";
import React from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { BiQrScan, BiPlayCircle } from "react-icons/bi";
import applestore from "/public/images/logo/appstore.png";
import googleplay from "/public/images/logo/googleplay.png";
const proofRequestURL = "your-proof-request-url";
import Image from "next/image";

const SignUp: React.FC = () => {
  return (
    <div className="rounded-sm  border bg-white shadow-default ">
      <div className="flex flex-wrap items-center">
        <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-10.5">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-[#FFFFFF] p-6">
              <div className="form-group text-center">
                <span className="font-bold text-gray-500">
                  Scan with <span className="text-red-700">Bhutan NDI</span>{" "}
                  Wallet
                </span>
              </div>

              <div className="flex rounded-2xl border-2 border-green-500 p-2.5">
                <QRCodeCanvas
                  value={proofRequestURL}
                  size={200}
                  imageSettings={{
                    src: "/images/logo/NDIlogobg.png",
                    excavate: true,
                    height: 50,
                    width: 50,
                  }}
                />
              </div>

              <div className="form-group mt-8">
                <div className="flex justify-center">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <ol className="list-decimal text-sm font-medium text-gray-400">
                            <li>Open Bhutan NDI Wallet on your phone.</li>
                            <li>
                              Tap the Scan button located on the menu bar <br />{" "}
                              and capture code.
                            </li>
                          </ol>
                        </td>
                        <td>
                          <span className="inline-block h-6 w-6 rounded-full bg-red-500 text-center">
                            <BiQrScan
                              className="p-0.5 pb-1.5 text-white"
                              size={25}
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* {os !== "Other" && (
                  <>
                    
                    <div className="form-group text-center mt-7.5">
                      <span className="text-[#A1A0A0]">
                        Open <span className="text-[#5AC994]">Bhutan NDI</span> Wallet{" "}
                        <a href={proofRequestURL} className="text-[#5AC994] underline">
                          here
                        </a>
                      </span>
                    </div>
                  </>
                )} */}
              <div className="mt-7.5 flex justify-center">
                <a
                  href="https://www.youtube.com/@BhutanNDI"
                  target="_blank"
                  rel="noreferrer"
                  className="btn flex items-center space-x-2 rounded-full bg-red-700 px-4 py-2 text-white"
                >
                  <span>Watch video guide</span>
                  <BiPlayCircle size={24} />
                </a>
              </div>
              <div className="mt-7.5 flex justify-center">
                <span>
                  <a
                    href="https://kiwhp.app.link/?t="
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A1A0A0] no-underline"
                  >
                    Download Now!
                  </a>
                </span>
              </div>
              <div className="mb-4 mt-2.5 flex justify-center">
                <a
                  href="https://play.google.com/store/search?q=bhutan%20ndi&amp;c=apps&amp;hl=en_IN&amp;gl=US"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={googleplay}
                    className="h-[30px] w-[99px]"
                    alt="Google Play Store"
                    width={100}
                    height={100}
                  />
                </a>
                <a
                  href="https://apps.apple.com/in/app/bhutan-ndi/id1645493166"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3"
                >
                  <Image
                    src={applestore}
                    className="h-[30px] w-[99px]"
                    alt="Apple App Store"
                    width={100}
                    height={100}
                  />
                </a>
              </div>
            </div>

            <div className="form-group mt-4 text-center">
              <span className="text-[#A1A0A0]">
                Already have an account?{" "}
                <Link href="/" className="font-bold text-red-700 underline">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
