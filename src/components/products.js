// components/startpage.js
import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import prod_1 from 'images/prod_1.jpg';
import prod_2 from 'images/prod_2.jpg';
import prod_3 from 'images/prod_3.jpg';
import logo from '../images/logo.png';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, query, where, collection, getDocs } from 'firebase/firestore';
import { updateProductsInFirestore } from 'utils/updateStore';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';

import VIP_1 from 'images/VIP_1.png';
import VIP_2 from 'images/VIP_2.png';
import VIP_3 from 'images/VIP_3.png';
import VIP_4 from 'images/VIP_4.png';
import VIP_5 from 'images/VIP_5.png';
import { removeLoader, showLoader } from './loader';

const images = {1:[VIP_1, 0.5], 2:[VIP_2, 1], 3:[VIP_3, 1.5], 4:[VIP_4, 2], 5:[VIP_5,2.5]};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (sessionError) {
        console.error('Session storage not available:', sessionError);
        try {
            return localStorage.getItem(key);
        } catch (localError) {
            console.error('Local storage not available:', localError);
            return null;
        }
    }
}


function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

export async function renderproducts (){
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;

    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;

    const storedUserId = getItemWithFallback('userId');
    
    element.innerHTML =
    `
    <div id="notification" class="notification">Copied!</div>

    <div class="com-overlayLoader">
        <div class="c-modal-body">
            <p class="" id="notifications">
                
            </p>
            <button class="notification-submit">Submit</button>
        </div>
    </div>

    <div id="p-modal" class="p-modal">
        <div class="p-modal-content" style="width:${finalWidth}px">
            
        </div>
    </div>

    <nav>
        <div class="ta-c">
            <img src="${logo}" alt="Logo">
        </div>
    </nav>
    <div class="wrapper">
        <div class="slideshow-container">
        <div class="mySlides fade">
            
            <img src="${prod_1}" style="width:100%">
        </div>
        <div class="mySlides fade">
            
            <img src="${prod_2}" style="width:100%">
        </div>
        <div class="mySlides fade">
            <img src="${prod_3}" style="width:100%">
        </div>
        <div class="dot-con">
            <span class="dot"></span> 
            <span class="dot"></span> 
            <span class="dot"></span> 
        </div>
    </div>
    <div class="prod">
    <h2 class="ta-c pt-10 pb-5 c-p">
        <span class="g-ct" id="g-ct"></span> / 
        <span class="g-t" id="g-t"></span>
    </h2>
    <div class="t-s d-f jc-sb al-it pt-b-10-15">
        <div class="d-f jc-sb al-it">
            <img src="" alt="Badge " class="vip_level">
            <h4 class="vipLevel">VIP </h4>
        </div>
        <h4 class="percentageLevel">%</h4>
    </div>
    <button class="btn-primary mt-15" id="startButton">Start</button>
    <div class="t-s d-f jc-sb pt-b-20-25 mt-20">
        <span class="fr-a h4">Frozen Amount</span>
        <span class="fr-a h4" id="fr-a"></span>
    </div>
    <div class="game-bottom d-f g-20 mt-15 ta-c">
        <div class="t-s f-c h-90 ta-c w-50 pt-10">
            <h6 class="pre  ta-c">Wallet Amount</h6>    
            <h4 class="mt-8 h4">USDT</h4>
            <h4 id="w-a" class="pt-5">realProfits </h4>
        </div>
        <div class="t-s h-90 ta-c w-50 pt-10">
            <h6 class="pre  ta-c">Today's Profits</h6>
            <h4 class="mt-8 h4">USDT</h4>
            <h4 id="to-p" class="pt-5"></h4>
        </div>
    </div>
</div>
</div>
    <div class="nav-bottom ta-c" style="width:${finalWidth}px">
        <div class="" id="homeBtn">
            <img src=${optimize} class="w-40" alt = "customer care">
            <h4>Home</h4> 
        </div>
        <div class="" id="startBtn">
                <img src=${home} class="w-45" alt= "starting">
            <h4>Starting</h4> 
        </div>
        <div class="" id="records">
            <img src=${records} class="w-40" alt = "customer care">
            <h4>Records</h4> 
        </div>
    </div>
    `
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        let slides = element.querySelectorAll(".mySlides");
        let dots =  element.querySelectorAll(".dot");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
        setTimeout(showSlides, 6000); // Change image every 2 seconds
    }
    
    function renderDesc(userData) {
        const vipLevel = userData.VIP_level;
        const numericVipLevel = vipLevel.replace('vip', '');
        const vipImage = element.querySelector('.vip_level')

        vipImage.src = `${images[numericVipLevel][0]}`;
        element.querySelector('.percentageLevel').textContent = `${images[numericVipLevel][1]}%`
        element.querySelector('.vipLevel').textContent = `VIP ${numericVipLevel}`
        element.querySelector('#fr-a').textContent = roundToTwoDecimals(parseFloat(userData.wallet_information.frozen_amount));
        element.querySelector('#w-a').textContent = roundToTwoDecimals(parseFloat(userData.wallet_information.wallet_balance));
        element.querySelector('#g-ct').textContent = userData.mission_information.completed
        element.querySelector('#g-t').textContent = userData.mission_information.total_tasks;
        element.querySelector('#to-p').textContent = userData.mission_information.profits_earned;
        const inviteCode = element.querySelector('#invitationCodeSpan')  
    }

    async function fetchData(username) {
         try {
             const usersRef = collection(db, 'members');
             const q = query(usersRef, where('username', '==', username));
             const querySnapshot = await getDocs(q);
                
             if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                 const userData = userDoc.data();
                   const currentUserId = userDoc.id;
                 return [userData, currentUserId];
             } else {
                 console.error('No such document!');
                 return null;
             }
         } catch (error) {
             console.error('Error getting document:', error);
             return null;
         }
     }

    function fetchUserData(username) {
        const memberCollection = collection(db, "members");
        const membersQuery = query(memberCollection, where('username', '==', username));
     
        // Set up a real-time listener
        onSnapshot(membersQuery, (memberSnapshot) => {
            if (!memberSnapshot.empty) {
                const userData = memberSnapshot.docs[0].data();
                renderDesc(userData);
            } else {
                console.error("No matching documents found.");
            }
        }, (error) => {
            console.error("Error fetching members: ", error);
        });
    }

    const navBottom = element.querySelector('.nav-bottom');
    navBottom.querySelector('#homeBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showLoaderAndNavigate('/home');
    });
    
    navBottom.querySelector('#startBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showLoaderAndNavigate('/starting');
    });
    
    navBottom.querySelector('#records').addEventListener('click', (e) => {
        e.preventDefault();
        showLoaderAndNavigate('/records');
    });
    // generate serial number for the products
    const transactionSerial = 'Tx_' + ('000000000' + Math.floor(Math.random() * 10000000000)).slice(-10);
    // get the time the item was submited
    const enteredDate = new Date().toLocaleString();
    
    const notifications = {
        "complete":"Congratulations! You have completed all tasks! Please check whether you have received all rewards! Increase the number of tasks by raising the VIP Level!",
        "pending": "Please submit the data to be processed before proceeding to the next data!"
    }

    const startButton = element.querySelector('#startButton');
   

    startButton.addEventListener('click', async () => {
        // showLoader
        showLoader();
        // fetch the data
        const userDataId = await fetchData(storedUserId);
        const userData = userDataId[0];
        const userId = userDataId[1];

        const productsArray = userData.mission_information.products_to_submit;
        let completedTask = userData.mission_information.completed;
        const currentItem = productsArray[completedTask];
        let walletAmount = parseFloat(userData.wallet_information.wallet_balance);
        const profits  = parseFloat(userData.profits);
        const turnTotItemArray = normalizeToArray(currentItem);
        let frozen_amount = parseFloat(userData.wallet_information.frozen_amount)
        
            if(completedTask === 0 && walletAmount <  100 ){
                document.querySelector('#notifications').textContent = ` You need minimum of 100 USDT to activate your Level`;
                setTimeout(() => {
                    removeLoader();
                    document.querySelector('.com-overlayLoader').classList.add('visible');
                }, 600);
                document.querySelector('.notification-submit').onclick = () => {
                    document.querySelector('.com-overlayLoader').classList.remove('visible');
                };
                return;
            }
        
        
        
        // make inside oya time to enter
        let currentItemArray = [];
        if(turnTotItemArray.length > 1){
            currentItemArray = turnTotItemArray.map(product => {
                const profit = roundToTwoDecimals(((parseFloat(product.price) * profits) / 100) * 10);
                return {
                    ...product,
                    prodProfits: profit // optional: to keep 2 decimal places
                };
            });
        }else{
            currentItemArray = turnTotItemArray.map(product => {
                const profit = roundToTwoDecimals(((parseFloat(product.price) * profits) / 100));
                return {
                    ...product,
                    prodProfits: profit // optional: to keep 2 decimal places
                };
            });
        }
        

  

        if (completedTask === productsArray.length) {
            document.querySelector('#notifications').textContent = notifications.complete;
            setTimeout(() => {
                removeLoader();
                document.querySelector('.com-overlayLoader').classList.add('visible');
            }, 600);
            document.querySelector('.notification-submit').onclick = () => {
                document.querySelector('.com-overlayLoader').classList.remove('visible');
            };
            return;
        }

        const records = userData.mission_information.records || [];

        const isItemInRecords = currentItemArray.every(currentItem => {
            return records.some(record => {
                if (Array.isArray(record.item)) {
                    return record.item.some(item =>
                        item.id === currentItem.id &&
                        item.price === currentItem.price &&
                        item.product_title === currentItem.product_title &&
                        item.prodProfits === currentItem.prodProfits &&
                        item.imageUrl === currentItem.imageUrl
                    );
                } else {
                    return record.item.id === currentItem.id &&
                        record.item.price === currentItem.price &&
                        record.item.product_title === currentItem.product_title &&
                        record.item.prodProfits === currentItem.prodProfits &&
                        record.item.imageUrl === currentItem.imageUrl;
                }
            });
        });


        if (walletAmount < 0 || isItemInRecords) {
            document.querySelector('#notifications').textContent = notifications.pending;
            setTimeout(() => {
                removeLoader();
                document.querySelector('.com-overlayLoader').classList.add('visible');
            }, 1000);
            document.querySelector('.notification-submit').onclick = () => {
                document.querySelector('.com-overlayLoader').classList.remove('visible');
            };
            return;
        }else{
        
        }

        
        const FirstcurrentItem = currentItemArray[0];
        const firstItemPrice = Number(FirstcurrentItem.price);
        const firstItemProfits = Number(FirstcurrentItem.prodProfits);
        const transactions = userData.mission_information.transactions || [];
        const originalBalance = roundToTwoDecimals(walletAmount + firstItemProfits)
        //check if the curretItemArray has more than one items
        const checkBalance = walletAmount - firstItemPrice;
        if(currentItemArray.length > 1){
            const secondCurrentItem = currentItemArray[1];
            const secondItemPrice = Number(secondCurrentItem.price);
            const secondItemProfits = Number(secondCurrentItem.prodProfits);
            const firstItemProfits = Number(FirstcurrentItem.prodProfits);
            // substract the price from the walletAmount
           
           // const productProfits = FirstcurrentItem.price * 

      
            if(checkBalance > 0){
                // Get profits from firstcurrentItem
                // frozen_amount to equal to the firstcurrentItem profits + walletAmount
                const checkBalance2 = checkBalance - parseInt(secondItemPrice);
                if(checkBalance2 < 0){
                    //set frozen amount;
                    frozen_amount = roundToTwoDecimals(walletAmount + parseFloat(firstItemProfits));   
                    walletAmount = roundToTwoDecimals(checkBalance2);
               }else{
                    const profitFromCombo = walletAmount + parseFloat(firstItemProfits) + parseFloat(secondItemProfits)
                    walletAmount = roundToTwoDecimals(profitFromCombo);
                }

            }else{
                
                const checkedWallet = walletAmount - (firstItemPrice + secondItemPrice) + parseFloat(firstItemProfits);
                frozen_amount = roundToTwoDecimals(walletAmount + parseFloat(firstItemProfits)); 
                walletAmount = roundToTwoDecimals(checkedWallet);
                
            }
        }else{
            walletAmount =  checkBalance;
            transactions.push({
                name:` Deduction ${FirstcurrentItem.product_title}`,
                date:enteredDate,
                amount:`-${FirstcurrentItem.price}`,
               })
        }

    
       

        // check if the currentItemArray is greater than 1 and update transactions array
    
            
        
        // update records 
       
        records.push({
            item: currentItemArray,
            transaction: transactionSerial,
            date: enteredDate,
            submission: false,
            currentItemPrice: FirstcurrentItem.price,
        });

        // updates records
        const updatedFields = {
            "mission_information.records": records,
        };
        
        await updateProductsInFirestore(userId, updatedFields);

        // check if the wallet amount is less than zero
        if (walletAmount < 0){
            // update the wallet and frozen amount
            const updatedFields = {
                "wallet_information.wallet_balance": walletAmount,
                "wallet_information.frozen_amount": frozen_amount,
                "mission_information.transactions": transactions,
            };

            await updateProductsInFirestore(userId, updatedFields);

            document.querySelector('#notifications').textContent = notifications.pending;
            setTimeout(() => {
                removeLoader();
                document.querySelector('.com-overlayLoader').classList.add('visible');
            }, 1000);
            document.querySelector('.notification-submit').onclick = () => {
                document.querySelector('.com-overlayLoader').classList.remove('visible');
            };


        } else {
            // Show success modal or other logic
            const modal = document.querySelector('#p-modal');
            const modalContents = document.querySelector('.p-modal-content');
            const currentItemRecord = records[completedTask];
            const currentRecordItemArray = currentItemRecord.item[0];
          
            const profitEarned = roundToTwoDecimals(parseFloat(firstItemProfits));
            modalContents.innerHTML = 
            `
            <div class="info-section ta-c">
                    <div class="t-info">
                        <img src="${currentRecordItemArray.imageUrl}" alt="Electronics" class="info-image">
                        <h2 class="product_title" id="product_title">${currentRecordItemArray.product_title}</h2>
                    </div>
                    <div class="details">
                        <div class="amount">
                            <div class="total-amount">
                                <p class="pre">Total Amount</p>
                            </div>
                            <span class="value">USDT</span>
                            <span class="current_price" id="current_price">${currentRecordItemArray.price}</span>
                        </div>
                        <div class="profits">
                            <div class="total-amount">
                                <p class="pre">Profits</p>
                            </div>
                            <div>
                                <span class="value">USDT </span>
                                <span class="current_price" id="current_price">${profitEarned}</span>
                            </div>
                        </div>
                    </div>
                    <div class="time">
                        <div class="creation-time">
                            <span>Item Number</span>
                            <span class="value">${currentItemRecord.transaction}</span>
                        </div>
                        <div class="creation-time">
                            <span>Creation Time</span>
                            <span class="value">${currentItemRecord.date}</span>
                        </div>
                    </div>
                    <button class="submit-btn">Submit</button>
                </div>
            `;
            setTimeout(() => {
                modal.style.display = 'block';
                removeLoader();
            }, 1000);

            const submitButton = document.querySelector('.submit-btn');
            submitButton.addEventListener('click', async () => {
                showLoader();

                // get the daily profit earning
                const  totalProfitEarned = parseFloat(userData.mission_information.profits_earned) || 0;
                
                // get the currentItem profits
                
                
                const currentProfits = totalProfitEarned + profitEarned;
        
                const curentItemPrice = parseFloat(currentItemRecord.currentItemPrice);
             
                const transactionAmount = roundToTwoDecimals(curentItemPrice + profitEarned)
                // actual wallet amount before deduction 
               const itemWorth = roundToTwoDecimals(parseFloat(currentItemRecord.currentItemPrice) + profitEarned);
               
                const walletBallance = originalBalance;
                

                // actual scammers Uganda as well are barack. 
                currentItemRecord.submission = true;
           

                completedTask += 1;
                
                transactions.push({
                    name:`Success ${FirstcurrentItem.product_title}`,
                    date:enteredDate,
                    amount:`+ ${transactionAmount}`,
                })

                const superiorId = userData.superior_information.direct_supervisor_id;
                if(superiorId){
                    const superiorWalletBalance =  await fetchSuperiorUsername(superiorId);
                    const superiorProfits = roundToTwoDecimals(parseFloat(superiorWalletBalance) + ((profitEarned * 12.5) / 100));

                              const updatedSuperiorWallet = {
                                    "wallet_information.wallet_balance":superiorProfits
                               }
                     await updateProductsInFirestore(superiorId, updatedSuperiorWallet);
                }

                const updatedFields = {
                    "mission_information.records": records,
                    "wallet_information.wallet_balance": walletBallance.toFixed(2),
                    "mission_information.transactions" : transactions,
                    "mission_information.completed" : completedTask,
                    "mission_information.profits_earned" : currentProfits.toFixed(2)
                };
                await updateProductsInFirestore(userId, updatedFields);
                        removeLoader();
                        modal.style.display = 'none';
                });

                
        }

    })

    fetchUserData(storedUserId);
    return element;
}

async function fetchSuperiorUsername(superiorId) {
    try {
        const superiorDocRef = doc(db, 'members', superiorId);
        const superiorDoc = await getDoc(superiorDocRef);
        if (superiorDoc.exists()) {
            const superiorData = superiorDoc.data();
            return superiorData.wallet_information.wallet_balance;
        } else {
            console.error('No such document for superior ID!');
            return null;
        }
    } catch (error) {
        console.error('Error getting superior document:', error);
        return null;
    }
}


function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function normalizeToArray(item) {
    if (typeof item === 'object' && !Array.isArray(item)) {
        // Check if item is a single object (not an array or null)
        const keys = Object.keys(item);
        if (keys.length > 0 && typeof item[keys[0]] === 'object') {
            // If the first key's value is an object, treat as nested objects
            return Object.values(item);
        } else {
            // Otherwise, treat as a single object
            return [item];
        }
    }
    return [];
}

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 1800); // Small delay to ensure loader is visible
}