import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Pengguna from "./Pengguna";
import Toko from "./Toko";

const Pengaturan = () => {
  const location = useLocation();

  const [isActivePengguna, setActivePengguna] = useState(
    location.pathname === "/pengaturan/pengguna" ? "tab-active" : ""
  );
  const [isActiveToko, setActiveToko] = useState(
    location.pathname === "/pengaturan/toko" ? "tab-active" : ""
  );

  useEffect(() => {
    if (location.pathname === "/pengaturan/pengguna") {
      setActivePengguna("tab-active");
    }
  }, [location.pathname]);

  return (
    <>
      <div className="tabs">
        <Link
          to={"/pengaturan/pengguna"}
          className={`tab tab-bordered  ${isActivePengguna}`}
          onClick={() => {
            setActivePengguna("tab-active");
            setActiveToko("");
          }}
        >
          Pengguna
        </Link>
        <Link
          to={"/pengaturan/toko"}
          className={`tab tab-bordered ${isActiveToko}`}
          onClick={() => {
            setActivePengguna("");
            setActiveToko("tab-active");
          }}
        >
          Toko
        </Link>
      </div>
      <div className="py-4">
        <Routes>
          <Route path="/pengguna" element={<Pengguna />} />
          <Route path="/toko" element={<Toko />} />
        </Routes>
      </div>
    </>
  );
};

export default Pengaturan;
