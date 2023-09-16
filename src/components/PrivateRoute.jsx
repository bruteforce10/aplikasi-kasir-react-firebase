import { useFirebase } from "./FirebiseProvider";
import { Link, Navigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { FiLogOut, FiLayout } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineSetting } from "react-icons/ai";
import { TbReportMoney } from "react-icons/tb";
import logo from "../assets/LOGO.png";
import { signOut } from "firebase/auth";
import { BsGlobe2 } from "react-icons/bs";

const PrivateRoute = (props) => {
  const { state } = useFirebase();
  const { user } = state;
  const location = useLocation();
  console.log(location, "dashboard");
  const [isHide, setHide] = useState(false);
  const { auth } = state;

  const handleSignOut = () => {
    signOut(auth);
  };

  if (user === null) {
    return <Navigate to="/login" state={location.pathname} />;
  } else {
    return (
      <div>
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <button
                  onClick={() => setHide(!isHide)}
                  className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                >
                  {!isHide ? (
                    <svg
                      id="toggleSidebarMobileHamburger"
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      id="toggleSidebarMobileClose"
                      className="w-6 h-6 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <Link className="text-xl font-bold flex items-center lg:ml-2.5">
                  <img src={logo} alt="logo" className="w-8 mr-2" />
                  <span className="self-center text-neutral whitespace-nowrap leading-8">
                    Gen Kasir
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  onClick={handleSignOut}
                  className="hidden sm:inline-flex ml-5 text-white bg-error hover:bg-red-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3"
                >
                  <FiLogOut className="mr-2" />
                  Log Out
                </Link>
                <Link
                  onClick={handleSignOut}
                  className=" sm:hidden ml-5 text-white bg-error hover:bg-red-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3"
                >
                  <FiLogOut />
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex flex-col overflow-hidden bg-white pt-16">
          <aside
            id="sidebar"
            className={
              isHide
                ? "fixed z-20 h-full top-0 left-0 pt-16 flex flex-shrink-0 flex-col  w-64 transition-width duration-300"
                : "fixed  z-20 h-full top-0 left-[-400px] lg:left-[0] pt-16 flex flex-shrink-0 flex-col w-64 transition-width duration-300"
            }
            aria-label="Sidebar"
          >
            <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 px-3 bg-white divide-y space-y-1">
                  <ul className="space-y-6 pb-2">
                    <li>
                      <Link
                        to={"/"}
                        className={
                          location.pathname === "/"
                            ? "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 font-warning bg-gray-200 group"
                            : "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-200 group"
                        }
                      >
                        <FiLayout size={24} />
                        <span className="ml-3">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/produk"}
                        className={
                          location.pathname !== "/transaksi" &&
                          location.pathname !== "/" &&
                          location.pathname !== "/pengaturan/pengguna" &&
                          location.pathname !== "/pengaturan/toko"
                            ? "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 font-warning bg-gray-200 group"
                            : "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-200 group"
                        }
                      >
                        <AiOutlineShoppingCart size={24} />
                        <span className="ml-3">Produk</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/transaksi"}
                        className={
                          location.pathname === "/transaksi"
                            ? "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 font-warning bg-gray-200 group"
                            : "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-200 group"
                        }
                      >
                        <TbReportMoney size={24} />
                        <span className="ml-3">Transaksi</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/pengaturan"}
                        className={
                          location.pathname === "/pengaturan/pengguna" ||
                          location.pathname === "/pengaturan/toko"
                            ? "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 font-warning bg-gray-200 group"
                            : "text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-200 group"
                        }
                      >
                        <AiOutlineSetting size={24} />
                        <span className="ml-3">Pengaturan</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
          <main>
            <div className="px-4 sm:px-6 mt-8 lg:px-8  lg:ml-64">
              {props.children}
            </div>
          </main>
          <div className="lg:ml-64">
            <footer className="bg-white md:flex md:items-center justify-center shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-4">
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.instagram.com/firdi_audi/"
                  className="text-gray-500 hover:text-gray-900"
                  target="_blank"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.firdiaudi.xyz"
                  className="text-gray-500 hover:text-gray-900"
                  target="_blank"
                >
                  <BsGlobe2 size={20} />
                </a>
                <a
                  href="https://github.com/bruteforce10"
                  className="text-gray-500 hover:text-gray-900"
                  target="_blank"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </footer>
            <p className="text-center text-sm text-gray-500 my-10">
              © 2022-2023{" "}
              <a className="hover:underline" target="_blank">
                Firdi Audi Putra
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default PrivateRoute;
