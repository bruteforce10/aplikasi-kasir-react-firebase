import React, { useEffect, useState } from "react";
import { useFirebase } from "../../../components/FirebiseProvider";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import LoadingRefresh from "../../../components/loadingRefresh";
import { enqueueSnackbar } from "notistack";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FiSave } from "react-icons/fi";
import noImage from "../../../assets/no_image.jpg";

const EditProduk = () => {
  const { state } = useFirebase();
  const { db, storage } = state;
  const params = useParams();
  const navigate = useNavigate();
  const { produkId } = params;
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSomethingChanged, setSomethingChanged] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    sku: "",
    harga: 0,
    stok: 0,
    deskripsi: "",
    foto: noImage,
  });

  const getData = () => {
    return new Promise((resolve) => {
      getDocs(collection(db, `toko/identitas/produk`)).then((res) => {
        res.forEach((doc) => {
          if (doc.id === produkId) {
            setForm({
              nama: doc.data().nama,
              sku: doc.data().sku || "",
              harga: doc.data().harga,
              stok: doc.data().stok,
              deskripsi: doc.data().deskripsi || "",
              foto: doc.data().foto || noImage,
            });
          }
        });
        resolve(true);
      });
    });
  };

  useEffect(() => {
    getData().then((res) => {
      setLoading(res);
    });
  }, [produkId]);

  const [error, setError] = useState({
    nama: "",
    sku: "",
    harga: "",
    stok: "",
    deskripsi: "",
  });
  const handleChange = (e) => {
    setSomethingChanged(true);
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

    if (!form.nama) {
      newError.nama = "Nama produk harus diisi";
    }

    if (!form.harga) {
      newError.harga = "Harga produk harus diisi";
    }

    if (!form.stok) {
      newError.stok = "Stok produk harus diisi";
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
        setSubmitting(true);
        const docPath = `toko/identitas/produk/${produkId}`;
        const docRef = doc(db, docPath);

        await setDoc(docRef, form, { merge: true });
        enqueueSnackbar("Produk Berhasil Diedit", { variant: "success" });
        setSubmitting(false);
        setSomethingChanged(false);
        navigate(`/produk`);
      } catch (e) {
        console.log(e);
        setSubmitting(false);
      }
    }
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];

    if (
      ![
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/gif",
      ].includes(file.type)
    ) {
      setError({
        ...error,
        foto: `File harus berupa gambar: ${file.type}`,
      });
    } else if (file.size >= 512000) {
      setError({
        ...error,
        foto: `File harus kurang dari 500kb`,
      });
    } else {
      setError({
        ...error,
        foto: "",
      });
      const pathRef = `toko/identitas/produk/${produkId}`;
      const storageRef = ref(storage, pathRef);
      setSubmitting(true);
      uploadBytes(storageRef, file).then((snapshot) => {
        setSubmitting(false);
        enqueueSnackbar("Foto Berhasil Diupload", { variant: "success" });
        getDownloadURL(snapshot.ref).then((url) => {
          setForm({
            ...form,
            foto: url,
          });
          setSomethingChanged(true);
        });
      });
    }
  };

  if (!loading) {
    return <LoadingRefresh />;
  }
  return (
    <div className="grid grid-cols-2">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-2xl my-4 font-medium">Edit Produk: {form.nama}</h2>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-gray-600">Nama Produk</span>
          </label>
          <input
            type="text"
            name="nama"
            disabled={isSubmitting}
            onChange={handleChange}
            required
            placeholder="Nama Produk"
            value={form.nama}
            className={
              error.nama
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.nama}</span>
          </label>
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-gray-600">SKU Produk</span>
          </label>
          <input
            type="text"
            name="sku"
            disabled={isSubmitting}
            onChange={handleChange}
            placeholder="SKU Produk"
            value={form.sku}
            className={
              error.sku
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.sku}</span>
          </label>
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-gray-600">Harga Produk</span>
          </label>
          <input
            type="number"
            name="harga"
            disabled={isSubmitting}
            onChange={handleChange}
            placeholder="Harga Produk"
            required
            value={form.harga}
            className={
              error.harga
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.harga}</span>
          </label>
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-gray-600">Stok Produk</span>
          </label>
          <input
            type="number"
            name="stok"
            disabled={isSubmitting}
            onChange={handleChange}
            placeholder="stok Produk"
            value={form.stok}
            required
            className={
              error.stok
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.stok}</span>
          </label>
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-gray-600">Deskripsi Produk</span>
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            name="deskripsi"
            onChange={handleChange}
            placeholder="deskripsi Produk"
            value={form.deskripsi}
            className={
              error.deskripsi
                ? "input input-bordered  text-neutral bg-white input-error block"
                : "input border-gray-300 text-neutral  bg-white block"
            }
          />
          <label className="label">
            <span className="label-text-alt text-error">{error.deskripsi}</span>
          </label>
        </div>
        <button
          disabled={isSubmitting || !isSomethingChanged}
          className="btn btn-success text-white"
        >
          <FiSave size={24} className="-mt-1" /> SIMPAN
        </button>
      </form>
      <div className="flex justify-center gap-8  flex-col items-center ">
        <div className="max-w-[350px] h-auto  w-full border-4">
          <img src={form.foto} alt="" className="w-full h-fit" />
        </div>
        <div className="form-control w-full max-w-xs ">
          <input
            type="file"
            disabled={isSubmitting}
            accept="image/*"
            onChange={handleUploadFile}
            className={
              error.foto
                ? "file-input file-input-bordered file-input-error w-full max-w-xs"
                : "file-input file-input-bordered file-input-neutral w-full max-w-xs"
            }
          />
          <label className="label">
            <span className="label-text-alt">{error.foto}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditProduk;
