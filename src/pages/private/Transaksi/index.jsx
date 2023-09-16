import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../../components/FirebiseProvider";
import LoadingRefresh from "../../../components/loadingRefresh";
import { Currency } from "../../../components/utils/Currency";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { enqueueSnackbar } from "notistack";

const Transaksi = () => {
  const { state } = useFirebase();
  const { db } = state;
  const [produkItems, setProdukItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    return new Promise((resolve) => {
      getDocs(collection(db, `toko/identitas/transaksi`)).then((res) => {
        setProdukItems(res.docs);
        resolve(true);
      });
    });
  };

  useEffect(() => {
    getData().then((res) => {
      setLoading(res);
    });
  }, []);

  const handleDelete = (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const docRef = doc(db, `toko/identitas/transaksi/${item.id}`);
      deleteDoc(docRef).then(() => {
        enqueueSnackbar("Transaksi Berhasil Dihapus", { variant: "success" });
        getData().then((res) => {
          setLoading(res);
        });
      });
    }
  };

  const [modal, setModal] = useState([]);
  const [modalDetail, setModalDetail] = useState([]);
  const handleEdit = (item) => {
    const id = Object.keys(item.items).map((key) => item.items[key]);
    setModal(item);
    setModalDetail(id);
    window.modalDetail.showModal();
  };

  if (!loading) {
    return <LoadingRefresh />;
  }

  return (
    <div className="mb-[200px]">
      <h2 className="text-2xl my-4 font-medium">Daftar Transaksi</h2>
      <div className="flex gap-5 flex-wrap ">
        {produkItems.length > 0 &&
          produkItems.map((item) => {
            const data = item.data();
            return (
              <div className="card w-[350px] flex-auto bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="card-title">{data.no}</h2>
                      <ul className="space-y-2">
                        <li>Tanggal : {data.tanggal}</li>
                        <li>Total : {Currency(data.total)}</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 w-fit gap-2">
                      <AiOutlineEyeInvisible
                        className="cursor-pointer"
                        onClick={() => handleEdit(data)}
                        size={24}
                      />
                      <BiTrash
                        className="cursor-pointer"
                        onClick={() => handleDelete(item)}
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {produkItems.length > 0 && (
          <dialog id="modalDetail" className="modal">
            <>
              <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">{modal.no}</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalDetail.map((item) => {
                        return (
                          <tr key={item}>
                            <td>{item.nama}</td>
                            <td>{item.jumlah}</td>
                            <td>{Currency(item.harga)}</td>
                            <td>{Currency(item.subtotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Total</th>
                        <th></th>
                        <th></th>
                        <th className="text-lg">{Currency(modal.total)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </form>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default Transaksi;
