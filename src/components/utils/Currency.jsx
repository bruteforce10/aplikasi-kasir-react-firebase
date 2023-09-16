export const Currency = (angka) => {
  const harga = Number(angka);
  return harga.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};
