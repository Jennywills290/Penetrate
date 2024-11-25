// components/startpage.js
import { handleRoute } from '../index';
import { getDocs, getFirestore, where, collection, query, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getMetadata, getDownloadURL,getStorage, ref, listAll } from 'firebase/storage';
import firebaseConfig from '../firebaseConfig';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import VIP_1 from 'images/VIP_1.png';
import VIP_2 from 'images/VIP_2.png';
import VIP_3 from 'images/VIP_3.png';
import VIP_4 from 'images/VIP_4.png';
import VIP_5 from 'images/VIP_5.png';
import locked from 'images/locked.svg';
import current from 'images/current.svg';
import { showLoader, removeLoader } from './loader';


// Initialize Firebase App and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Storage (assuming you need to fetch images from Firebase storage)
const storage = getStorage(app);

const vipImages = [VIP_1, VIP_2, VIP_3, VIP_4, VIP_5];

// Utility functions for storage with fallback
function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

// Fetch user data
async function getUserData(username) {
    try {
        const usersCollection = collection(db, 'members');
        const q = query(usersCollection, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Assuming usernames are unique and you want the first match
            return [userDoc.data(), userDoc.id];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user VIP level:', error);
        return null;
    }
}

async function fetchAllProducts(vipLevel, intertraining) {
    let allProducts = [];
    const PRODUCTS_PER_VIP = 60;
    const productCountForVip = [40, 45, 50, 55, 60];

    try {
        const listRef = ref(storage, 'products');
        const res = await listAll(listRef);
        const productPromises = res.items.map(async (itemRef) => {
            try {
                const metadata = await getMetadata(itemRef);
                const downloadURL = await getDownloadURL(itemRef);
                return {
                    id: parseInt(metadata.customMetadata.id),
                    product_title: metadata.customMetadata.product_title,
                    price: parseFloat(metadata.customMetadata.price),
                    imageUrl: downloadURL
                };
            } catch (error) {
                console.error('Error fetching metadata or URL for item:', itemRef.fullPath, error);
                return null;
            }
        });
        const fetchedProducts = await Promise.all(productPromises);
        allProducts = fetchedProducts.filter(product => product !== null);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }

   
    allProducts.sort((a, b) => a.id - b.id);


    // Validate VIP level
    if (vipLevel < 1 || vipLevel > 5) {
        console.error('Invalid VIP Level:', vipLevel);
        return [];
    }

    let startValue;
    let endValue;
    console.log(intertraining)
    // check if it's an internal account
    if(intertraining == 'internal'){
        startValue = 74; 
        endValue = 119;
    }else{

        // Determine start and end indices based on VIP level
        startValue = (vipLevel - 1) * PRODUCTS_PER_VIP;
        endValue = startValue + PRODUCTS_PER_VIP;

    }
   


    // Ensure the slicing indices are within the bounds of the allProducts array
    if (startValue >= allProducts.length) {
        console.error('Start value is out of bounds:', startValue);
        return [];
    }
    const slicedProducts = allProducts.slice(startValue, Math.min(endValue, allProducts.length));
   

    // Shuffle the sliced products
    const shuffledProducts = slicedProducts.sort(() => Math.random() - 0.5);
    

    // Determine the number of products to return for the given VIP level
    const numberOfProductsToReturn = productCountForVip[vipLevel - 1];
   
    console.log(shuffledProducts.slice(0, numberOfProductsToReturn));
    return shuffledProducts.slice(0, numberOfProductsToReturn);
    
}




// Render Start Page
export async function renderStartPage() {
    const element = document.createElement('main');
    const nav = document.createElement('div');
    nav.className = 'p-20'
    nav.innerHTML =
   `
        <h2 class="ta-c vip-heading">
            VIP Levels
        </h2>
    
   `
    element.className = 'container';
    element.appendChild(nav)
   const section = document.createElement('section');
   element.appendChild(section);
   const wrapper = document.createElement('div');
   wrapper.className = 'wrapper'
    section.appendChild(wrapper);

    const storedUserId = getItemWithFallback('userId'); // Assuming userId is stored in session storage
    if (!storedUserId) {
        return element;
    }

    const userDataArray = await getUserData(storedUserId);
    const userData = userDataArray[0];
    const currentUserId = userDataArray[1];
    
    const vipLevel = userData.VIP_level;
    
    // fetch the records

    const vipLevels = [
        { level: 1, profit: "0.5%", ratings: 40, withdraw: 100 },
        { level: 2, profit: "1%", ratings: 45, withdraw: 500 },
        { level: 3, profit: "1.5%", ratings: 50, withdraw: 1500 },
        { level: 4, profit: "2%", ratings: 55, withdraw: 3000 },
        { level: 5, profit: "2.5%", ratings: 60, withdraw: 5000 }
    ];

    // Fetch products based on VIP level
    vipLevels.forEach((level, index) => {
       
        const vipCard = document.createElement('div');
        const isCurrentLevel = vipLevel === `vip${level.level}`;
        vipCard.className = `vip-card ${isCurrentLevel ? 'current' : 'locked'}`;
        vipCard.innerHTML = `
            <div class="d-f al-it jc-sb">
                <div class="d-f gap-14 al-it">
                    <div>
                        <img src="${vipImages[index]}" alt="Badge ${level.level}" class="vip_level">
                    </div>
                    <div>
                        <h2>VIP ${level.level}</h2>
                        <ul>
                            <li class="pre">Per Rating Profit ${level.profit}</li>
                            <li class="pre">${level.ratings} Rating Completed / Day</li>
                            <li class="pre">Activate with ${level.withdraw} USDT</li>
                        </ul>
                    </div>
                </div>
                <div class="w-68">
                    <div class="status ${isCurrentLevel ? 'current' : 'locked ta-c'}">
                        <img src="${isCurrentLevel ? current : locked}" alt="current icon">
                    </div>
                </div>
            </div>
        `;
        vipCard.onclick = async () => {
        showLoaderForMinimumDuration(500).then(async () => {
            if (isCurrentLevel) {
                try {
                    let records = userData.mission_information.products_to_submit;
                    let isCombination_active = userData.mission_information.combination_active;
                    let combinations = userData.mission_information.combination;
                    let combinationIndex = userData.mission_information.combinationNumber;
                    const vipString = userData.VIP_level;
                    const intertraining = userData.member_information.type
                    const newVipLevel = parseInt(vipString.replace('vip', ''));


                    let products;
                    const parsedCombinationIndex = parseInt(combinationIndex);
                   
                    if (records.length > 0) {
                        if (isCombination_active) {
                            // convert to obeject no support for nested array
                            // Replace the element at parsedCombinationIndex with combinations
                            records.splice(parsedCombinationIndex, 1, combinations);
                            // Empty combination
                            combinations = {};
                            // Update the combination_active
                            isCombination_active = false;
                            // Update the combinationIndex
                            combinationIndex = 0;
                        } else {
                            // Assign products to records if isCombination_active is false
                            // 
                        }
                    } else {
                        // Fetch the products based on the vipLevel
                        records = await fetchAllProducts(newVipLevel, intertraining);
                        
                        if (isCombination_active) {
                            
                            // Replace the element at parsedCombinationIndex with combinations
                            records.splice(combinationIndex, 1, combinations);
                            // Empty combination
                            combinations = {};
                            // Update the combination_active
                            isCombination_active = false;
                            // Update the combinationIndex
                            combinationIndex = 0;
                        } else {
                            // Assign products to records if isCombination_active is false
                            // products = records;
                        }
                    }
                    
                    // Update all properties used
                    await updateFirestoreBooking(currentUserId, records, combinations, isCombination_active, combinationIndex);
                    
                    removeLoaderAndNavigate('/products')
                   
                } catch (error) {
                    removeLoader()
                    console.error('Error handling VIP card click:', error);

                }
            }
        })
        };
        

        vipCard.style.pointerEvents = isCurrentLevel ? 'auto' : 'none';
        vipCard.style.cursor = isCurrentLevel ? 'pointer' : 'none';

        wrapper.appendChild(vipCard);
    });
 
    async function updateFirestoreBooking(currentUserId , records, combinations, isCombination_active, combinationIndex) {
        const docRef = doc(db, 'members', currentUserId);

        // Prepare the updates object
        const updates = {
            'mission_information.combination': combinations,
            'mission_information.combinationNumber': combinationIndex || 0,
            'mission_information.combination_active': isCombination_active,
            'mission_information.products_to_submit': records,
        };

        // Update Firestore document
        updateDoc(docRef, updates)
            .then(() => {
              
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    }

    function getScreenWidth() {
        return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
    }

    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;

    const navBottom = document.createElement('div');
    navBottom.className = 'nav-bottom';
    navBottom.style.width = `${finalWidth}px`;
    navBottom.innerHTML = `
        <div class="" id="home">
            <img src=${optimize} alt="customer care">
            <h4>Home</h4> 
        </div>
        <div class="" id="startBtn">
            <img src=${home} alt="starting">
            <h4>Starting</h4> 
        </div>
        <div class="" id="records">
            <img src=${records} alt="customer care">
            <h4>Records</h4> 
        </div>
    `;
    navBottom.querySelector('#home').addEventListener('click', () => {
        showLoaderAndNavigate('/home');
    });
    navBottom.querySelector('#startBtn').addEventListener('click', (e) => {
        showLoaderAndNavigate('/starting');
    });
    navBottom.querySelector('#records').addEventListener('click', (e) => {
        showLoaderAndNavigate('/records');
    });
    element.appendChild(navBottom);
    return element;
}
function showLoaderAndNavigate(path){
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 1000); // Small delay to ensure loader is visible
}
function removeLoaderAndNavigate(path) {
    removeLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
    }, 1000); // Small delay to ensure loader is visible
}

function showLoaderForMinimumDuration(duration) {
    return new Promise(resolve => {
        showLoader();
         setTimeout(() => {
            resolve();
        }, duration);
    });
}