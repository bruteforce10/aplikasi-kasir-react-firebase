import React, { useState } from "react";
import { useFirebase } from "../../../components/FirebiseProvider";
import { addDoc, collection } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const Modal = () => {
  const { state } = useFirebase();
  const { db } = state;
  const [nama, setNama] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [id, setId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (nama === "") {
        setError("Nama produk harus diisi");
      }
      var addProduk = await addDoc(collection(db, "toko/identitas/produk"), {
        nama,
      });
      setId(addProduk.id);
    } catch (e) {
      console.log(e.massage);
    }
    setSubmitting(false);
  };

  if (id) {
    return <Navigate to={`edit/${id}`} />;
  }
  return (
    <>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text text-gray-600">Buat Produk Baru</span>
            </label>
            <input
              type="text"
              name="nama"
              disabled={isSubmitting}
              placeholder="Nama Produk"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                setError("");
              }}
              className={
                error
                  ? "input input-bordered  text-neutral bg-white input-error block"
                  : "input border-gray-300 text-neutral  bg-white block"
              }
            />
            <label className="label">
              <span className="label-text-alt text-error">{error}</span>
            </label>
          </div>

          <div className="modal-action">
            <button className="btn">Close</button>
            <button
              disabled={isSubmitting}
              className="btn btn-success"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Modal;
