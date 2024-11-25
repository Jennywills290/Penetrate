import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update products in Firestore
export async function updateProductsInFirestore(userDocId, updatedFields) {
    try {
        const userRef = doc(db, 'members', userDocId);
        await updateDoc(userRef, updatedFields);
        console.log('Products updated successfully in Firestore');
    } catch (error) {
        console.error('Error updating products in Firestore:', error.message, error.code);
    }
}
