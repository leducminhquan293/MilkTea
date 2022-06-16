import { collection, addDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import moment from "moment";

import db from '../firebase';
import TableName from "../tableName";

const donHangRef = collection(db, TableName.DonHang);
const getGiamGiaByNgayDat = async (value) => {
    let temp = [];
    let date = moment(value).format('DD/MM/YYYY');
    const res = query(donHangRef, where('ngayDat', '==', date));
    const querySnapshot = await getDocs(res);
    
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        temp.push(data);
    });

    return temp;
}

const addDonHang = async (params) => { 
    await addDoc(donHangRef, params) 
};

const updateGiamGiaByNgayDat = async (value, params) => { 
    let temp = await getGiamGiaByNgayDat(value);

    if (temp.length === 0) // lần đầu
        addDonHang(params)
    else
        updateDoc(doc(db, TableName.DonHang, temp[0].id), params);
};


const DonHangHook = {
    getGiamGiaByNgayDat,
    addDonHang,
    updateGiamGiaByNgayDat
}

export default DonHangHook;