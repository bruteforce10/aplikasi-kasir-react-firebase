import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registrasi from "./pages/registrasi";
import Login from "./pages/login";
import LupaPassword from "./pages/lupa-password";
import NotFound from "./pages/404";
import Private from "./pages/private";
import FirebaseProvider from "./components/FirebiseProvider";
import PrivateRoute from "./components/PrivateRoute";

// notistack
import { SnackbarProvider } from "notistack";
import Transaksi from "./pages/private/Transaksi";
import Produk from "./pages/private/produk";
import Home from "./pages/private/Home";

function App() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <FirebaseProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path="pengaturan/*"
                element={
                  <PrivateRoute>
                    <Private />
                  </PrivateRoute>
                }
              />
              <Route
                path="produk/*"
                element={
                  <PrivateRoute>
                    <Produk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaksi"
                element={
                  <PrivateRoute>
                    <Transaksi />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route path="/registrasi" element={<Registrasi />} />
              <Route path="/login" element={<Login />} />
              <Route path="/lupa-password" element={<LupaPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </FirebaseProvider>
    </SnackbarProvider>
  );
}

export default App;
