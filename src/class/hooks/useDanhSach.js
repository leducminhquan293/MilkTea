import { collection, addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
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

const getDanhSach = async (date) => {
    let temp = [];
    const danhSachRef = collection(db, TableName.DanhSach);
    const res = query(danhSachRef, where('CreatedDate', '==', getStartOfToday()), where('CreatedDate', '==', getEndOfToday()));
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