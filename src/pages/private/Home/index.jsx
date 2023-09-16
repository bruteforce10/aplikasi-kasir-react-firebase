import React, { useEffect, useState } from "react";
import { useFirebase } from "../../../components/FirebiseProvider";
import LoadingRefresh from "../../../components/loadingRefresh";
import {
  Transaction,
  addDoc,
  collection,
  doc,
  getDocs,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { enqueueSnackbar } from "notistack";
import { Currency } from "../../../components/utils/Currency";
import { format } from "date-fns";

const Home = () => {
  const { state } = useFirebase();
  const { db } = state;
  const [loading, setLoading] = useState(false);
  const [produkItems, setProdukItems] = useState([]);
  const todayDateString = format(new Date(), "yyyy-mm-dd");
  const [filterData, setFilterData] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const initialTransaksi = {
    no: "",
    items: {},
    total: 0,
    tanggal: todayDateString,
  };
  const [transaksi, setTransaksi] = useState(initialTransaksi);
  const [loadingTransaksi, setLoadingTransaksi] = useState(true);
  const [totTransaksi, setTotTransaksi] = useState(0);

  const addTransaksi = async () => {
    if (Object.keys(transaksi.items).length <= 0) {
      enqueueSnackbar("Produk Belum Ditambahkan", { variant: "error" });
    } else {
      const docPath = `toko/identitas/transaksi`;
      const docRef = collection(db, docPath);

      setSubmitting(true);
      try {
        await addDoc(docRef, { ...transaksi, timestamp: Date.now() }).then(
          () => {
            enqueueSnackbar("Transaksi Berhasil Ditambahkan", {
              variant: "success",
            });
            setTransaksi({
              ...initialTransaksi,
              no: `${transaksi.tanggal}/${totTransaksi + 1}`,
            });
            setSubmitting(false);
          }
        );

        const querySnapshot = await getDocs(
          collection(db, "toko/identitas/produk")
        );

        const updatePromises = querySnapshot.docs.map((doce) => {
          const docRef = doc(db, `toko/identitas/produk/${doce.id}`);
          return runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);

            // Tambahkan pengecekan apakah transaksi.items[doce.id] ada
            if (transaksi.items[doce.id] && transaksi.items[doce.id].jumlah) {
              const item = transaksi.items[doce.id].jumlah;
              let newStok = parseInt(sfDoc.data().stok) - parseInt(item);

              if (newStok < 0) {
                newStok = 0;
              }

              transaction.update(docRef, {
                stok: newStok,
              });
            }
          });
        });

        await Promise.all(updatePromises);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDataTransaksi = async () => {
    try {
      await getDocs(collection(db, `toko/identitas/transaksi`)).then((res) => {
        if (res.docs.length > 0) {
          setTransaksi({
            ...transaksi,
            no: `${transaksi.tanggal}/${res.docs.length + 1}`,
          });
          setTotTransaksi(res.docs.length + 1);
        } else {
          setTransaksi({
            ...transaksi,
            no: `${transaksi.tanggal}/${1}`,
          });
          setTotTransaksi(1);
        }

        setLoadingTransaksi(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataTransaksi();
  }, []);

  const getData = () => {
    return new Promise((resolve) => {
      getDocs(collection(db, `toko/identitas/produk`)).then((res) => {
        setProdukItems(
          res.docs.filter((produkDok) => {
            if (filterData) {
              return produkDok
                .data()
                .nama.toLowerCase()
                .includes(filterData.toLowerCase());
            } else {
              return true;
            }
          })
        );

        resolve(false);
      });
    });
  };

  useEffect(() => {
    getData().then((res) => {
      setLoading(res);
    });
  }, [filterData, addTransaksi]);

  const addItem = (produkDok) => {
    let newItem = { ...transaksi.items[produkDok.id] };
    const produkData = produkDok.data();

    if (newItem.jumlah) {
      newItem.jumlah += 1;
      newItem.subtotal = produkData.harga * newItem.jumlah;
    } else {
      newItem.jumlah = 1;
      newItem.harga = produkData.harga;
      newItem.subtotal = produkData.harga;
      newItem.nama = produkData.nama;
    }

    const newItems = {
      ...transaksi.items,
      [produkDok.id]: newItem,
    };

    if (newItem.jumlah > produkData.stok) {
      enqueueSnackbar("Jumlah Melebihi Stok Produk", { variant: "error" });
    } else {
      setTransaksi({
        ...transaksi,
        items: newItems,
        total: Object.keys(newItems).reduce((total, key) => {
          const item = newItems[key];
          return total + Number(item.subtotal);
        }, 0),
      });
    }
  };

  const handleChangeJumlah = (item) => (e) => {
    let newItem = { ...transaksi.items[item] };
    const value = parseInt(e.target.value);

    newItem.jumlah = value;
    newItem.subtotal = newItem.harga * newItem.jumlah;
    const produkDoc = produkItems.find((key) => key.id === item);
    const produkData = produkDoc.data();

    const newItems = {
      ...transaksi.items,
      [item]: newItem,
    };

    if (newItem.jumlah > produkData.stok) {
      enqueueSnackbar("Jumlah Melebihi Stok Produk", { variant: "error" });
    } else {
      setTransaksi({
        ...transaksi,
        items: newItems,
        total: Object.keys(newItems).reduce((total, key) => {
          const item = newItems[key];
          return total + Number(item.subtotal);
        }, 0),
      });
    }
  };

  if (loadingTransaksi && !loading) {
    return <LoadingRefresh />;
  }

  return (
    <div className=" max-w-[1240px] px-8">
      <div className="grid justify-items-center pb-[100px] grid-cols-2 max-md:grid-cols-1 gap-4">
        <div className="w-full">
          <div className=" max-md:px-10">
            <h2 className="text-2xl my-4 font-medium ">Buat Transaksi Baru</h2>
            <div className="my-4 flex max-md:flex-col gap-4 justify-between">
              <input
                type="text"
                className="sm"
                placeholder="No Transaksi"
                value={transaksi.no}
                readOnly
              />
              <button
                className="btn btn-accent"
                onClick={addTransaksi}
                disabled={isSubmitting}
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Item</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(transaksi.items).map((item, index) => {
                  const itemData = transaksi.items[item];
                  return (
                    <tr key={item}>
                      <th>{index + 1}</th>
                      <td>{itemData.nama}</td>
                      <td>
                        <input
                          type="number"
                          value={itemData.jumlah}
                          className="w-8"
                          onChange={handleChangeJumlah(item)}
                        />
                      </td>
                      <td>{Currency(itemData.harga)}</td>
                      <td>{Currency(itemData.subtotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>TOTAL</th>
                  <th></th>
                  <th></th>
                  <th className="text-lg">{Currency(transaksi.total)}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="space-y-4  w-full text-center mx-auto md:pl-[90px]">
          <input
            type="text"
            placeholder="Cari Produk"
            autoFocus
            onChange={(e) => {
              setFilterData(e.target.value);
            }}
            className="input input-bordered w-full xl:max-w-xs "
          />
          <div className="space-y-4 h-full max-h-[500px] overflow-y-auto">
            {produkItems &&
              produkItems.map((item) => {
                const itemData = item.data();
                return (
                  <div
                    className="btn w-full xl:max-w-xs h-fit justify-start mx-auto bg-transparent py-2 flex gap-4 lowercase font-normal"
                    key={itemData.id}
                    disabled={itemData.stok <= 0}
                    onClick={() => addItem(item)}
                  >
                    <div className="avatar w-16">
                      <div className="w-32 rounded">
                        <img src={itemData.foto} alt="gambar-produk" />
                      </div>
                    </div>
                    <div className="text-start space-y-1">
                      <h3 className="font-medium text-md">{itemData.nama}</h3>
                      <p className="text-sm text-gray-500">
                        Stok : {itemData.stok}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
