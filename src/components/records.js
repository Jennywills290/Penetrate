import { handleRoute } from '../index';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDoc, where, getDocs, doc } from 'firebase/firestore'; // Add necessary Firestore imports
import firebaseConfig from '../firebaseConfig';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { removeLoader, showLoader } from './loader';
import { updateProductsInFirestore } from 'utils/updateStore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Ensure Firestore is initialized correctly

export function renderRecords() {
    // Fetching from database
    async function fetchUserData(username) {
        try {
            const usersRef = collection(db, 'members');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                sessionStorage.setItem('userData', JSON.stringify(userData));
                return userData;
            } else {
                console.error('No such document!');
                return null;
            }
        } catch (error) {
            console.error('Error getting document:', error);
            return null;
        }
    }

    async function getUserId(username) {
        const usersCollection = collection(db, 'members');
        const q = query(usersCollection, where('username', '==', username));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Assuming usernames are unique and you want the first match
            return userDoc.id;
        } else {
            console.log("No such document!");
            return null;
        }
    }

    // Get the screen width based on screen size
    function getScreenWidth() {
        return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
    }

    function roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }

    function setItemWithFallback(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (sessionError) {
            console.error('Session storage not available:', sessionError);
            try {
                localStorage.setItem(key, value);
            } catch (localError) {
                console.error('Local storage not available:', localError);
            }
        }
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

    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;

    function getItemWithFallback(key) {
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

    function roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }
  

    const storedUserId = getItemWithFallback('userId');
    // Display records based on the selected tab type
    const displayRecords = async (tabType) => {
       
       
            const userData = await fetchUserData(storedUserId);
    
        if (userData) {
            const records = userData.mission_information.records || [];
            recordsList.innerHTML = '';
            console.log(records);
            let filteredRecords = records.slice().reverse();
            if (tabType === 'submission') {
                filteredRecords = filteredRecords.filter(record => !record.submission);
                console.log(filteredRecords);
            } else if (tabType === 'completed') {
                filteredRecords = filteredRecords.filter(record => record.submission);
            }
            const notifications = {
                "complete":"Congratulations! You have completed all tasks! Please check whether you have received all rewards! Increase the number of tasks by raising the VIP Level!",
                "pending": "Please submit the data to be processed before proceeding to the next data!"
            }
            filteredRecords.forEach((record, index) => {
                const recordItem = document.createElement('div');
                recordItem.className = 'record-item';
        
                // Function to create card HTML
                const createCardHTML = (item, isFirstItem, submission, profits, date, isMultiple, index) => {
                    return `
                        <div class="cards records" data-id="${index}">
                            <div class="side-1 d-f jc-sb">
                                <div>
                                    <h4>${item.product_title}</h4>
                                    <p><img src="${item.imageUrl}" alt="${item.product_title}"></p>
                                </div>
                                <div class="">
                                    <div class="sub-btn">
                                        ${isFirstItem && isMultiple ? `
                                            <button class="crd-btn completed-btn ${submission ? 'submitted' : 'disabled'}" ${submission ? '' : 'disabled'}>
                                                ${submission ? 'Completed' : 'Submission'}
                                            </button>
                                            ${submission ? '' : '<button class="crd-btn sub-now submit-now">Submit Now</button>'}
                                            ` : isFirstItem ? `
                                            <button class="crd-btn completed-btn sub-now ${submission ? 'submitted' : 'submit-now'}">
                                                ${submission ? 'Completed' : 'Submit'}
                                            </button>
                                        ` : '<button class="crd-btn pending-btn">Pending</button>'
                                        }
                                    </div>
                                    <h6 class="date-clicked pre">${date}</h6>
                                </div>
                            </div>
                            <div class="side-2">
                                <div class="d-f jc-sb">
                                    <div>
                                        <span class="curenc pre">USDT</span> 
                                        <span class="cur-v pre">${item.price}</span>
                                    </div>
                                    <div>
                                        <h6 class="pre">Total Amount</h6>
                                    </div>
                                </div>
                                <hr>
                                <div class="d-f jc-sb">
                                    <div>
                                        <span class="currenc">USDT</span> 
                                        <span class="currenc">${profits}</span>
                                    </div>
                                    <div>
                                        <h6 class="pre">Profits</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                };

                
                
                // Check if record.item is an array
                const isMultipleItems = Array.isArray(record.item) && record.item.length > 1
                console.log(isMultipleItems)
                if (isMultipleItems) {
                    console.log(record.item)
                    // Display the first item regularly
                    recordItem.innerHTML += createCardHTML(record.item[0], true, record.submission, record.item[0].prodProfits, record.date, true, index);
        
                    // Display the rest of the items with a "Pending" button
                    for (let i = 1; i < record.item.length; i++) {
                        recordItem.innerHTML += createCardHTML(record.item[i], false, record.submission, record.item[i].prodProfits, record.date, false, index);
                    }
                } else {
                    // Display the single item
                    recordItem.innerHTML += createCardHTML(record.item[0], true, record.submission, record.item[0].prodProfits, record.date, false, index);
                }
        
                // Add event listener for "Submit Now" button
                const submitButton = recordItem.querySelector('.sub-now');
                if (submitButton) {
                    submitButton.addEventListener('click', async () => { // Make the function async
                        const transactions = userData.mission_information.transactions || [];
                        // Update the record submission status
                        // check if the wallet Balance is negative
                        if(userData.wallet_information.wallet_balance < 0){
                            // Show overlay and loader
                            document.querySelector('#notifications').textContent = notifications.pending;
                            showLoader();
                            setTimeout(function() {
                                removeLoader();
                                // If wallet balance is negative, show notification
                                document.querySelector('.com-overlayLoader').classList.add('visible');
                            }, 400);
                            document.querySelector('.notification-submit').onclick = () => {
                                document.querySelector('.com-overlayLoader').classList.remove('visible');
                            };
                        } else {
                            console.log(records)
                            submitButton.classList.add('submitted')
                            submitButton.classList.remove('submit-now');
                            submitButton.textContent = 'Completed'
                            //if there is pending change the button to complete
                            const card = submitButton.closest('.cards.records')
                            const itemIndex = card.dataset.id;
                            const pendingButton = document.querySelector(`.cards.records[data-id="${itemIndex}"] .crd-btn.pending-btn`);
                            if(pendingButton){
                                pendingButton.textContent = 'Completed';
                                pendingButton.classList.remove('pending-btn');
                                pendingButton.classList.add('submitted');
                            }

                            let completedTask = userData.mission_information.completed;
                            const currentItemRecord = records[completedTask];
                            const walletBalance = parseFloat(userData.wallet_information.wallet_balance);
                            const profits  = parseFloat(userData.profits);
                            // get the profit earned so far
                            const  profitEarned = parseFloat(userData.mission_information.profits_earned) || 0;
                            let itemProfit;
                            let wallet_amount;
                            let itemWorth
                            let secItemProfit = 0;
                            if(currentItemRecord.item.length > 1){
                                itemProfit =  roundToTwoDecimals(parseFloat((currentItemRecord.item[1].prodProfits) + parseFloat(currentItemRecord.item[0].prodProfits)));
                                secItemProfit = roundToTwoDecimals(parseFloat((currentItemRecord.item[0].prodProfits)));

                                wallet_amount = roundToTwoDecimals(parseFloat(walletBalance) + itemProfit)
                                itemWorth = roundToTwoDecimals(itemProfit + parseFloat(currentItemRecord.item[1].price)); 
                            
                            }else{
                                itemProfit  = roundToTwoDecimals(parseFloat(currentItemRecord.item[0].prodProfits));
                           
                                itemWorth = roundToTwoDecimals(itemProfit + parseFloat(currentItemRecord.item[0].price));
                               
                                
                                wallet_amount = roundToTwoDecimals(walletBalance + parseFloat(currentItemRecord.item[0].prodProfits));
                            }
                          
                            console.log(secItemProfit)
                            const recordProfits = roundToTwoDecimals(parseFloat(profitEarned) + parseFloat(itemProfit))
                            
                            records[completedTask].submission = true;
                           
                            completedTask += 1;
                            const enteredDate = new Date().toLocaleString();

                            // Check if currentItemRecord.item[1] exists before accessing its properties
                            if (currentItemRecord.item.length > 1 && currentItemRecord.item[1]) {
                                transactions.push(
                                {
                                    name:` Deduction ${currentItemRecord.item[1].product_title}`,
                                    date:enteredDate,
                                    amount:`+${itemProfit + parseFloat(currentItemRecord.item[1].price)}`,
                                },
                                {
                                    name:` Deduction ${currentItemRecord.item[1].product_title}`,
                                    date:enteredDate,
                                    amount:`-${parseFloat(currentItemRecord.item[1].price)}`
                                },
                                {
                                    name:` Deduction ${currentItemRecord.item[0].product_title}`,
                                    date:enteredDate,
                                    amount:`+${secItemProfit + parseFloat(currentItemRecord.item[0].price)}`,
                                },
                                {
                                    name:` Deduction ${currentItemRecord.item[0].product_title}`,
                                    date:enteredDate,
                                    amount:`-${parseFloat(currentItemRecord.item[0].price)}`,
                                   }
                                )
                            } else {
                                transactions.push({
                                    name: `Success ${currentItemRecord.item[0].product_title}`,
                                    date: enteredDate,
                                    amount: `+ ${itemWorth}`,
                                });
                            }
                             const updatedFields = {
                                 "mission_information.records": records,
                                 "wallet_information.wallet_balance":roundToTwoDecimals(wallet_amount),
                                 "mission_information.completed" : completedTask,
                                 "mission_information.profits_earned" : recordProfits.toFixed(2),
                                 "mission_information.transactions":transactions
                             };
                             //get Id from dataBase 
                             const userDocId =  await getUserId(storedUserId); // Await for the user ID
                             // update dataBase
                             await updateProductsInFirestore(userDocId, updatedFields); // Await for the update operation
                             const superiorId = userData.superior_information.direct_supervisor_id
                             if(superiorId){
                               const superiorWalletBalance =  await fetchSuperiorUsername(superiorId);
                               const superiorProfits = roundToTwoDecimals(parseFloat(superiorWalletBalance) + ((itemProfit * 12.5) /100));
                                const updatedSuperiorWallet = {
                                        "wallet_information.wallet_balance":superiorProfits
                                }
                                await updateProductsInFirestore(superiorId, updatedSuperiorWallet);
                             }
                             

                             //fetch the senior account and update the wallet;
                        }
                    });
                }
                recordsList.appendChild(recordItem);
            });
        } else {
        }
    };

    // Create the main element
    const element = document.createElement('div');
    element.className = 'container';
    element.innerHTML = `
    <div class="tabs-container">
        <div class="tabs-records">
            <h1 class="title">Records</h1>
            <div class="tabs">
                <div class="tab active" data-tab="all">ALL</div>
                <div class="tab" data-tab="submission">Submission</div>
                <div class="tab" data-tab="completed">Completed</div>
            </div>
        </div>
        
        <div id="records-list" class="records-list"></div>
    </div>
    <div class="com-overlayLoader">
        <div class="c-modal-body">
            <p class="" id="notifications">
                
            </p>
            <button class="notification-submit">Submit</button>
        </div>
    </div>
    <div class="nav-bottom ta-c" style="width:${finalWidth}px">
        <div class="nav-btn" id="homeBtn">
            <img src=${optimize} class="w-40" alt="customer care">
            <h4>Home</h4>
        </div>
        <div class="nav-btn" id="startBtn">
            <img src=${home} class="w-45" alt="starting">
            <h4>Starting</h4>
        </div>
        <div class="nav-btn" id="recordsBtn">
            <img src=${records} class="w-40" alt="customer care">
            <h4>Records</h4>
        </div>
    </div>
    `;

    const tabs = element.querySelectorAll('.tab');
    const recordsList = element.querySelector('#records-list');

    tabs.forEach(tab => {
        tab.addEventListener('click', async () => { // Make the function async
            document.querySelector('.tab.active').classList.remove('active');
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            await displayRecords(tabType); // Await for the displayRecords function
        });
    });
    
    displayRecords('all');

    // Event listeners for navigation buttons
    element.querySelector('#homeBtn').addEventListener('click', () => {
        showLoaderAndNavigate('/home');
    });
    element.querySelector('#startBtn').addEventListener('click', () => {
        showLoaderAndNavigate('/starting');
    });
    element.querySelector('#recordsBtn').addEventListener('click', () => {
        showLoaderAndNavigate('/records');
    });

    return element;
}

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 800); // Small delay to ensure loader is visible
}

