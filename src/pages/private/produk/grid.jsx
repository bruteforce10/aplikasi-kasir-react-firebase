import React, { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import Modal from "./modal";
import { useFirebase } from "../../../components/FirebiseProvider";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import LoadingRefresh from "../../../components/loadingRefresh";
import { Link } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const GridProduk = () => {
  const [margin, setMargin] = useState(false);
  const { state } = useFirebase();
  const { db } = state;

  const [produkItems, setProdukItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    return new Promise((resolve) => {
      getDocs(collection(db, `toko/identitas/produk`)).then((res) => {
        setProdukItems(res.docs);
        resolve(true);
      });
    });
  };

  useEffect(() => {
    getData().then((res) => {
      setLoading(res);
    });

    const handleScroll = () => {
      const footer = document.querySelector("#footer");
      const scrollY = window.scrollY;
      console.log(window);
      // if (footer.offsetTop) {
      //   setMargin(true);
      // } else if (scrollY > 100) {
      //   setMargin(false);
      // }
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleDelete = (item) => {
    const docRef = doc(db, `toko/identitas/produk/${item.id}`);
    deleteDoc(docRef).then(() => {
      enqueueSnackbar("Produk Berhasil Dihapus", { variant: "success" });
      getData().then((res) => {
        setLoading(res);
      });
    });
  };

  if (!loading) {
    return <LoadingRefresh />;
  }

  return (
    <div className="pb-[100px]">
      <h2 className="text-2xl my-4 font-medium ">Daftar Produk</h2>

      {produkItems.length <= 0 && (
        <h2 className="text-2xl my-4 font-italic">Belom ada Produk</h2>
      )}
      <div className="flex  justify-center  flex-wrap gap-5 ">
        {produkItems.map((item) => {
          const itemData = item.data();
          return (
            <div
              key={itemData.id}
              className="card w-[350px] flex-auto bg-base-100 shadow-md"
            >
              <figure>
                {itemData.foto && (
                  <img src={itemData.foto} className="w-full max-w-[200px]" />
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl">{itemData.nama}</h2>
                <p>{itemData.deskripsi}</p>
                <p>Rp. {itemData.harga}</p>
                <p>STOK : {itemData.stok}</p>
                <p>SKU : {itemData.sku}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                  <button className="btn btn-accent">
                    <Link to={`/produk/edit/${item.id}`}>Edit</Link>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => window.my_modal_1.showModal()}
        className={
          !margin
            ? "w-10 h-10 bg-[#22C39E] hover:bg-[#1da182] rounded-full cursor-pointer flex items-center justify-center fixed bottom-[0px] right-0 mr-[30px] mb-[40px]"
            : "w-10 h-10 bg-[#22C39E] hover:bg-[#1da182] rounded-full cursor-pointer flex items-center justify-center fixed bottom-[200px] right-0 mr-[30px] mb-[40px]"
        }
      >
        <BiPlus size={30} className="text-white" />
      </div>
      <div id="footer"></div>
      <Modal />
    </div>
  );
};

export default GridProduk;
