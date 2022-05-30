import { collection, addDoc, getDocs } from "firebase/firestore";
import db from '../firebase';

const getThuongHieu = async () => {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "ThuongHieu"));
    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        temp.push(doc.data())
    });

    return temp;
}

const ThuongHieuHook = {
    getThuongHieu
}

export default ThuongHieuHook;