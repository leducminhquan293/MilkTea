import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const thuongHieuRef = collection(db, TableName.ThuongHieu);
const getThuongHieu = async () => {
    let temp = [];
    const res = query(thuongHieuRef, where('HienThi', '==', true), orderBy('value'));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const getThuongHieuDropDown = async () => {
    let temp = [];
    const res = query(thuongHieuRef, where('HienThi', '==', true), orderBy('value'));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        let single = {
            value: doc.data().value,
            label: doc.data().label
        }
        temp.push(single)
    });

    return temp;
}

const ThuongHieuHook = {
    getThuongHieu,
    getThuongHieuDropDown
}

export default ThuongHieuHook;