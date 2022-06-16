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

const getThuongHieuByValue = async (id) => {
    let temp = [];
    const res = query(thuongHieuRef, where('value', '==', id));
    const querySnapshot = await getDocs(res);

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
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
    getThuongHieuByValue,
    getThuongHieuDropDown
}

export default ThuongHieuHook;