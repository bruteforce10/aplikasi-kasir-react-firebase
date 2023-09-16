import validator from "validator";
import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, setDoc, query } from "firebase/firestore";
import { useFirebase } from "../../../components/FirebiseProvider";
import { enqueueSnackbar } from "notistack";
import LoadingRefresh from "../../../components/loadingRefresh";

const Toko = () => {
  const { state } = useFirebase();
  const { docRef, db, user } = state;
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    website: "",
  });

  const [error, setError] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    website: "",
  });

  const validate = () => {
    const newError = { ...error };

    if (!form.nama) {
      newError.nama = "Nama Toko harus diisi";
    }
    if (!form.alamat) {
      newError.alamat = "Alamat Toko harus diisi";
    }
    if (!form.telepon) {
      newError.telepon = "Telepon Toko harus diisi";
    }
    if (!form.website) {
      newError.website = "Website Toko harus diisi";
    } else if (!validator.isURL(form.website)) {
      newError.website = "Website tidak valid";
    }

    return newError;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const findErrors = validate();
    if (Object.values(findErrors).some((err) => err !== "")) {
      setError(findErrors);
    } else {
      setSubmitting(true);
      try {
        await setDoc(docRef, form, { merge: true });
        enqueueSnackbar("Toko Berhasil Ditambahkan", { variant: "success" });
      } catch (e) {
        enqueueSnackbar(e.code, { variant: "error" });
      }
      setSubmitting(false);
    }
  };

  const getData = () => {
    const q = query(collection(db, "toko"));
    return new Promise((resolve) => {
      getDocs(q)
        .then((res) => {
          res.forEach((doc) => {
            let data = doc.data();
            setForm({
              nama: data.nama,
              alamat: data.alamat,
              telepon: data.telepon,
              website: data.website,
            });
            resolve(true);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  useEffect(() => {
    getData().then((res) => {
      setLoading(res);
    });
  }, []);

  if (!loading) {
    return <LoadingRefresh />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-gray-600">Nama Toko</span>
          </label>
          <input
            type="text"
            name="nama"
            placeholder="Nama Toko"
            onChange={handleChange}
            value={form.nama}
            className={
              error.nama
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
            required
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.nama}</span>
          </label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-gray-600">Alamat Toko</span>
          </label>
          <textarea
            type="text"
            name="alamat"
            placeholder="Alamat Toko"
            onChange={handleChange}
            value={form.alamat}
            className={
              error.nama
                ? "textarea textarea-bordered  text-neutral bg-white textarea-error block"
                : "textarea border-gray-300 text-neutral  bg-white block"
            }
            required
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.nama}</span>
          </label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-gray-600">No Telepon Toko</span>
          </label>
          <input
            type="number"
            name="telepon"
            placeholder="No Telepon Toko"
            onChange={handleChange}
            value={form.telepon}
            className={
              error.telepon
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
            required
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.telepon}</span>
          </label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-gray-600">Website Toko</span>
          </label>
          <input
            type="url"
            name="website"
            placeholder="Website Toko"
            onChange={handleChange}
            value={form.website}
            className={
              error.website
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
            required
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.website}</span>
          </label>
        </div>
        <button className="btn btn-success text-white" type="submit">
          Simpan
        </button>
      </form>
    </div>
  );
};

export default Toko;
