import { collection, addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import db from '../firebase';
import TableName from "../tableName";

const getThuongHieu = async () => {
    let temp = [];
    const thuongHieuRef = collection(db, TableName.ThuongHieu);
    const res = query(thuongHieuRef, where('HienThi', '==', true), orderBy('value'));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const ThuongHieuHook = {
    getThuongHieu
}

export default ThuongHieuHook;