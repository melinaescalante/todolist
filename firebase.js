// Importo las configuraciones
import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    getDoc,
    setDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

//   Inicio de la app
  const app = initializeApp(firebaseConfig);

//   Creo base de datos de la app
const db=getFirestore(app)
//   Creo las funciones
export const guardarRecordatorioFirebase = async ( recordatorio ) => {
    try {
        const doc = await addDoc( collection( db, 'recordatorio'), recordatorio  );
        return doc.id;
    } catch (error) {
        console.error(error);
    }
}
