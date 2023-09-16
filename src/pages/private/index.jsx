import React from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Pengaturan from "./Pengaturan";
import Produk from "./produk";

const Private = () => {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/*" element={<Pengaturan />} />
      </Routes>
      {location.pathname === "/pengaturan" && (
        <Navigate to="/pengaturan/pengguna" />
      )}
    </>
  );
};

export default Private;
