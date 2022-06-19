import { collection, addDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import moment from "moment";

import db from '../firebase';
import TableName from "../tableName";

const toppingRef = collection(db, TableName.Topping);
const getTopping = async () => {
    let temp = [];
    const res = query(toppingRef, where('hienThi', '==', true), orderBy('value'));
    const querySnapshot = await getDocs(res);

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
    });

    return temp;
}

const getToppingByThuongHieu = async (id) => {
    let temp = [];
    const res = query(toppingRef, where('idBrand', '==', id), orderBy('value'));
    const querySnapshot = await getDocs(res);

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
    });

    return temp;
}

const getLatestValue = async () => {
    let temp = -1;
    const res = query(toppingRef, orderBy('value', 'desc'), limit(1));
    const querySnapshot = await getDocs(res);
    
    querySnapshot.forEach((doc) => {
        temp = doc.data().value;
    });
    
    return temp;
}

const addTopping = async (params) => { 
    let latest = await getLatestValue();
    let id = latest === -1 ? 1 : latest + 1;
    params.value = id;
    await addDoc(toppingRef, params);
};

const updateTopping = async (id, params) => { 
    updateDoc(doc(db, TableName.Topping, id), params);
};

const deleteTopping = async (id) => { 
    updateDoc(doc(db, TableName.Topping, id), { hienThi: false });
};

const ToppingHook = {
    getTopping,
    getToppingByThuongHieu,
    addTopping,
    updateTopping,
    deleteTopping
}

export default ToppingHook;