import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import isEmail from "validator/lib/isEmail";
import { useFirebase } from "../../components/FirebiseProvider";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AppLoading from "../../components/AppLoading";
import background from "../../assets/background.png";
import dashboard from "../../assets/dashboard.png";

const Registrasi = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    ulangi_password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    ulangi_password: "",
  });
  const { state } = useFirebase();
  const { auth, user, loading } = state;
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newError = { ...error };
    if (!form.email) {
      newError.email = "Email harus diisi";
    } else if (!isEmail(form.email)) {
      newError.email = "Email tidak valid";
    }

    if (!form.password) {
      newError.password = "Password harus diisi";
    }

    if (!form.ulangi_password) {
      newError.ulangi_password = "Ulangi Password harus diisi";
    } else if (form.ulangi_password !== form.password) {
      newError.ulangi_password = "Ulangi Password tidak sama";
    }

    return newError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const findErrors = validate();

    if (Object.values(findErrors).some((err) => err !== "")) {
      setError(findErrors);
    } else {
      try {
        setSubmitting(!isSubmitting);

        await createUserWithEmailAndPassword(auth, form.email, form.password);
      } catch (error) {
        const errorCode = error.code;
        const newError = {};
        console.log(errorCode);
        switch (errorCode) {
          case "auth/email-already-in-use":
            newError.email = "Email Sudah Terdaftar";
            break;
          case "auth/invalid-email":
            newError.email = "Email tidak valid";
            break;
          case "auth/weak-password":
            newError.password = "Password terlalu pendek";
            break;
          case "auth/operation-not-allowed":
            newError.email = "Tidak ada akses";
            break;
          default:
            newError.email = "Error";
            break;
        }
        setError(newError);
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return <AppLoading />;
  }
  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mx-auto grid grid-cols-2 max-md:grid-cols-1 bg-white h-screen  ">
      <div className=" px-[70px] h-screen flex  justify-center flex-col ">
        <form
          className="flex flex-col gap-2 max-md:items-center"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="text-start w-full max-w-xs">
            <h3 className="text-2xl font-semibold text-neutral mb-3 ">
              Registrasi
            </h3>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text  text-gray-700">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Alamat Email"
              className={
                error.email
                  ? "input input-bordered  text-neutral bg-transparent input-error block"
                  : "input border-gray-300 text-neutral  bg-transparent block"
              }
              required
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label className="label">
              <span className="label-text-alt text-error">{error.email}</span>
            </label>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text  text-gray-700">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={
                error.password
                  ? "input input-bordered input-error bg-transparent block"
                  : "input border-gray-300 text-neutral  bg-transparent block"
              }
              required
              value={form.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {error.password}
              </span>
            </label>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text  text-gray-700">Ulangi Password</span>
            </label>
            <input
              type="password"
              name="ulangi_password"
              placeholder="Password"
              className={
                error.ulangi_password
                  ? "input input-bordered input-error bg-transparent block"
                  : "input border-gray-300 text-neutral  bg-transparent block"
              }
              required
              value={form.ulangi_password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label className="label">
              <span className="label-text-alt text-error">
                {error.ulangi_passwords}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success max-w-xs w-full text-white"
          >
            Daftar
          </button>
          <p className="my-2">
            Already have an account?{" "}
            <span className="text-primary">
              <Link to="/login">Login Here</Link>
            </span>{" "}
          </p>
        </form>
      </div>
      <div
        className="px-[70px]   bg bg-image bg-cover relative max-md:h-[550px]"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="mt-20 max-sm:mt-10">
          <h4 className="text-xl max-xl:text-lg max-md:text-sm font-medium text-neutral">
            Gen Kasir adalah solusi terbaik untuk bisnis saya. Kemudahan dan
            kecepatan transaksi membuat segalanya lebih efisien. Semua data
            tersimpan dengan rapi dan dapat diakses kapan saja. Terima kasih
            kepada Gen Kasir, bisnis saya semakin maju dan lebih profesional!
          </h4>
          <p className=" text-gray-700 my-3 text-md max-sm:text-lg">
            Firdi Audi Putra, Pengusaha Muda
          </p>
        </div>
        <img
          src={dashboard}
          alt="contoh dashboard"
          className=" absolute w-[650px] max-xl:w-[590px] max-lg:w-[450px] max-md:w-[500px] right-0 bottom-0"
        />
      </div>
    </div>
  );
};

export default Registrasi;
