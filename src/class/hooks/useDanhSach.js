import { collection, addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from 'moment';

import db from '../firebase';
import TableName from "../tableName";

const getStartOfToday = () => {
    const now = new Date()
    now.setHours(5, 0, 0, 0) // +5 hours for Eastern Time
    console.log(now)
    return now;
}

const getEndOfToday = () => {
    const now = new Date()
    now.setHours(23, 59, 59, 999)
    console.log(now)
    return now;
}

const getDanhSach = async (value) => {
    let temp = [];
    const danhSachRef = collection(db, TableName.DanhSach);
    let date = moment(value).format('DD/MM/YYYY');
    const res = query(danhSachRef, where('CreatedDate', '==', date));
    const querySnapshot = await getDocs(res);
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const addDanhSach = async (params) => { 
    await addDoc(collection(db, TableName.DanhSach), params) 
};

const DanhSachHook = {
    getDanhSach,
    addDanhSach
}

export default DanhSachHook;