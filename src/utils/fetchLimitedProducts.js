import { getStorage, ref,listAll, getDownloadURL, getMetadata} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const storage = getStorage();
// function to fetch the products and map it to return an array of the properties of the products 
// I can save this to the local storage
export async function fetchLimitedProducts(numberOfTasks) {
    let allProducts = [];
    const maxProducts = numberOfTasks;

    const storageRef = ref(storage, 'products');

    try {
        const res = await listAll(storageRef);
        const limitedItems = res.items.slice(0, maxProducts);

        const productPromises = limitedItems.map(async (itemRef) => {
            try {
                const metadata = await getMetadata(itemRef);
                const downloadURL = await getDownloadURL(itemRef);
                return {
                    id: metadata.customMetadata.id,
                    product_title: metadata.customMetadata.product_title,
                    price: metadata.customMetadata.price,
                    imageUrl: downloadURL
                };
            } catch (error) {
                
                return null;
            }
        });

        allProducts = await Promise.all(productPromises);

        let filteredProducts = allProducts.filter(product => product !== null).sort((a, b) => a.id - b.id);
        filteredProducts = shuffleArray(filteredProducts);
        return filteredProducts;
    } catch (error) {
       
        return [];
    }
}

// Shuffle 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}