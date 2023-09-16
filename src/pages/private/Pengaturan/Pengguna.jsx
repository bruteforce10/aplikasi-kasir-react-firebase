import React, { useState, useRef } from "react";
import { useFirebase } from "../../../components/FirebiseProvider";
import {
  updateProfile,
  updateEmail,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";
import { enqueueSnackbar } from "notistack";
import isEmail from "validator/lib/isEmail";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const Pengguna = () => {
  const { state } = useFirebase();
  const { user, auth } = state;
  const [error, setError] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  console.log(user);

  const saveDisplayName = () => {
    const displayName = displayNameRef.current.value;
    if (displayName === "") {
      setError({
        displayName: "Nama Wajib Diisi",
      });
      setSubmitting(false);
    } else if (displayName !== user.displayName) {
      setSubmitting(true);
      updateProfile(auth.currentUser, { displayName }).then(() => {
        enqueueSnackbar("Nama User Berhasil di Update", { variant: "success" });
        setSubmitting(false);
      });
    }
  };

  const handleUpdateEmail = () => {
    const email = emailRef.current.value;
    if (!email) {
      setError({
        email: "Email Wajib Diisi",
      });
    } else if (!isEmail(email)) {
      setError({
        email: "Email tidak valid",
      });
    } else if (email !== user.email) {
      setSubmitting(true);
      updateEmail(auth.currentUser, email)
        .then(() => {
          enqueueSnackbar("Email Berhasil di Update", { variant: "success" });
          setSubmitting(false);
        })
        .catch((error) => {
          let emailError = "";
          console.log(error.code);
          switch (error.code) {
            case "auth/email-already-in-use":
              emailError = "Email Sudah Terdaftar";
              break;
            case "auth/invalid-email":
              emailError = "Email tidak valid";
              break;
            case "auth/requires-recent-login":
              emailError = "Silahkan Logout, kemungkinan Untuk Login Kembali";
              break;
            default:
              emailError = "Error";
              break;
          }
          setError({
            email: emailError,
          });
          setSubmitting(false);
        });
    }
  };

  const handleEmailVerification = () => {
    setSubmitting(true);
    sendEmailVerification(auth.currentUser).then(() => {
      enqueueSnackbar(
        `Email Verifikasi Telah dikirim ke ${emailRef.current.value}`,
        { variant: "success" }
      );
      setSubmitting(false);
    });
  };

  const handleUpdatePassword = () => {
    const newPassword = passwordRef.current.value;
    setSubmitting(true);
    if (!newPassword) {
      setError({
        password: "Password Wajib Diisi",
      });
    } else {
      updatePassword(auth.currentUser, newPassword)
        .then(() => {
          enqueueSnackbar("Password Berhasil di Update", {
            variant: "success",
          });
          setSubmitting(false);
        })
        .catch((error) => {
          let errorPassword = "";
          switch (error.code) {
            case "auth/weak-password":
              errorPassword = "Password terlalu pendek";
              break;
            case "auth/requires-recent-login":
              errorPassword =
                "Silahkan Logout, kemungkinan Untuk Login Kembali";
              break;
            default:
              errorPassword = "Error";
              break;
          }
          setError({
            password: errorPassword,
          });
          setSubmitting(false);
        });
    }
  };

  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-gray-600">Nama</span>
        </label>
        <input
          type="text"
          name="displayName"
          onBlur={saveDisplayName}
          placeholder="Nama Anda"
          className={
            error.displayName
              ? "input input-bordered  text-neutral bg-white input-error block"
              : "input border-gray-300 text-neutral  bg-white block"
          }
          required
          ref={displayNameRef}
          defaultValue={user.displayName}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt text-error">{error.displayName}</span>
        </label>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-gray-600">Email</span>
        </label>
        <input
          type="email"
          name="email"
          onBlur={handleUpdateEmail}
          placeholder="Email Anda"
          className={
            error.displayName
              ? "input input-bordered  text-neutral bg-white input-error block"
              : "input border-gray-300 text-neutral  bg-white block"
          }
          required
          ref={emailRef}
          defaultValue={user.email}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt text-error">{error.email}</span>
        </label>
        {user.emailVerified ? (
          <h3 className="text-success font-semibold">Email Sudah Verifikasi</h3>
        ) : (
          <button
            onClick={handleEmailVerification}
            className="btn bg-[#39deb8] hover:bg-[#56a190] text-white"
          >
            <MdOutlineMarkEmailRead size={24} />
            Kirim Email Verifikasi
          </button>
        )}
      </div>
      <div className="form-control w-full max-w-xs mt-3">
        <label className="label">
          <span className="label-text text-gray-600">Password</span>
        </label>
        <input
          type="password"
          name="displayName"
          onBlur={handleUpdatePassword}
          placeholder="Password Baru"
          className={
            error.displayName
              ? "input input-bordered  text-neutral bg-white input-error block"
              : "input border-gray-300 text-neutral  bg-white block"
          }
          required
          ref={passwordRef}
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt text-error">{error.password}</span>
        </label>
      </div>
    </div>
  );
};

export default Pengguna;
