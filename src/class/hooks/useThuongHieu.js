import { collection, addDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const thuongHieuRef = collection(db, TableName.ThuongHieu);
const getThuongHieu = async () => {
    let temp = [];
    const res = query(thuongHieuRef, where('HienThi', '==', true), orderBy('value'));
    const querySnapshot = await getDocs(res);
    
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data)
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

const getLatestValue = async () => {
    let temp = -1;
    const res = query(thuongHieuRef, orderBy('value', 'desc'), limit(1));
    const querySnapshot = await getDocs(res);
    
    querySnapshot.forEach((doc) => {
        temp = doc.data().value;
    });
    
    return temp;
}

const addBrand = async (params) => { 
    let latest = await getLatestValue();
    let id = latest === -1 ? 1 : latest + 1;
    params.value = id;
    await addDoc(thuongHieuRef, params);
};

const updateBrand = async (id, params) => { 
    updateDoc(doc(db, TableName.ThuongHieu, id), params);
};

const deleteBrand = async (id) => { 
    updateDoc(doc(db, TableName.ThuongHieu, id), { HienThi: false });
};

const ThuongHieuHook = {
    getThuongHieu,
    getThuongHieuByValue,
    getThuongHieuDropDown,
    addBrand,
    updateBrand,
    deleteBrand
}

export default ThuongHieuHook;