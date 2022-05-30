import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import db from '../firebase';
import TableName from "../tableName";

const getThuongHieu = async () => {
    let temp = [];
    const querySnapshot = await getDocs(query(collection(db, TableName.ThuongHieu), orderBy('value')));
    querySnapshot.forEach((doc) => {
        temp.push(doc.data())
    });

    return temp;
}

const ThuongHieuHook = {
    getThuongHieu
}

export default ThuongHieuHook;