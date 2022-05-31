import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const sanPhamRef = collection(db, TableName.SanPham);
const sanPhamDeleteRef = collection(db, TableName.SanPham, );
const getSanPhamByThuongHieu = async () => {
    let temp = [];
    const res = query(sanPhamRef, orderBy('value'));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const addSanPham = async (params) => { 
    await addDoc(sanPhamRef, params) 
};

const deleteSanPham = async () => { 
    await deleteDoc(doc(sanPhamRef)) 
};

const SanPhamHook = {
    getSanPhamByThuongHieu,
    addSanPham,
    deleteSanPham
}

export default SanPhamHook;