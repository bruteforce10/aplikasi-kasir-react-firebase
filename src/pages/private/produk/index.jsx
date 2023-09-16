import React from "react";
import { Route, Routes } from "react-router-dom";
import EditProduk from "./edit";
import GridProduk from "./grid";

const Produk = () => {
  return (
    <Routes>
      <Route path="/edit/:produkId" element={<EditProduk />} />
      <Route path="/" element={<GridProduk />} />
    </Routes>
  );
};

export default Produk;
