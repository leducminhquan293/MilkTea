import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const sanPhamRef = collection(db, TableName.SanPham);
const getSanPhamByThuongHieu = async (id) => {
    let temp = [];
    const res = query(sanPhamRef, where('idBrand', '==', id), orderBy('value'));
    const querySnapshot = await getDocs(res);

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
    });

    return temp;
}

const getSanPhamDoc = async () => {
    let temp = [];
    const res = query(sanPhamRef, orderBy('value'));
    const querySnapshot = await getDocs(res);

    querySnapshot.forEach((doc) => {
        temp.push(doc)
    });

    return temp;
}

const getSanPhamById = async (id) => {
    const querySnapshot = await getDoc(doc(db, TableName.SanPham, id));
    let data = querySnapshot.data();
    data.id = querySnapshot.id;

    return data;
}

const addSanPham = async (params) => { 
    await addDoc(sanPhamRef, params) 
};

const deleteSanPham = async (params) => { 
    const res = query(sanPhamRef, orderBy('value'));
    const querySnapshot = await getDocs(res);
    
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
    });
};

const SanPhamHook = {
    getSanPhamDoc,
    getSanPhamByThuongHieu,
    getSanPhamById,
    addSanPham,
    deleteSanPham
}

export default SanPhamHook;