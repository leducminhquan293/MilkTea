import { collection, addDoc, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import moment from 'moment';

import db from '../firebase';
import TableName from "../tableName";

const danhSachRef = collection(db, TableName.DanhSach);
const getDanhSach = async (value) => {
    let temp = [];
    console.log('vaavava',value)
    let date = moment(value).format('DD/MM/YYYY');
    const res = query(danhSachRef, where('createdDate', '==', date));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
    });

    return temp;
}

const addDanhSach = async (params) => {
    await addDoc(danhSachRef, params)
};

const updateDanhSach = async (id, params) => { 
    updateDoc(doc(db, TableName.DanhSach, id), params);
};

const deleteDanhSachById = async (id) => { 
    deleteDoc(doc(db, TableName.DanhSach, id));
};

const DanhSachHook = {
    getDanhSach,
    addDanhSach,
    updateDanhSach,
    deleteDanhSachById
}

export default DanhSachHook;