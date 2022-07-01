import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

import db from '../firebase';
import TableName from "../tableName";

const quaySoRef = collection(db, TableName.QuaySo);

const addQuaySo = async (params) => { 
    await addDoc(quaySoRef, params) 
};

const QuaySoHook = {
    addQuaySo
}

export default QuaySoHook;