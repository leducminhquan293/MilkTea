import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import db from '../firebase';
import TableName from "../tableName";

const getSanPhamByThuongHieu = async () => {
    let temp = [];
    const querySnapshot = await getDocs(query(collection(db, TableName.SanPham), orderBy('value')));
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const SanPhamHook = {
    getSanPhamByThuongHieu
}

export default SanPhamHook;