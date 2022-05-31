import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const getSanPhamByThuongHieu = async () => {
    let temp = [];
    const sanPhamRef = collection(db, TableName.SanPham);
    const res = query(sanPhamRef, orderBy('value'));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const SanPhamHook = {
    getSanPhamByThuongHieu
}

export default SanPhamHook;