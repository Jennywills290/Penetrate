import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import record from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';
import { getFirestore, collection, doc, where, runTransaction, query, getDocs } from 'firebase/firestore';
import { updateProductsInFirestore } from 'utils/updateStore';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility functions
function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

// Fetch wallet userData
async function fetchUserData(username) {
    try {
        const usersRef = collection(db, 'members');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
           
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const currentUserId = userDoc.id;
            const agentAccount = userData.superior_information.highest_superior_username;
            const withdrawalPassword = userData.wallet_information.withdrawal_password;
            const walletBalance = userData.wallet_information.wallet_balance;
            const walletAddress = userData.wallet_address_information.address || '';
            const completedTask = userData.mission_information.completed;
            const totalTasks = userData.mission_information.total_tasks;
            const getIndexArray = userDoc.data().withdrawal_information.records || [];
            const credibility = userData.member_information.reputation_points;
            return { credibility, currentUserId, agentAccount, withdrawalPassword, walletBalance, walletAddress, completedTask, totalTasks, getIndexArray};
        } else {
            console.error('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        return null;
    }
}

// Render Withdrawal function
export async function renderWithdrawal() {
    // Retrieve userId (username) from session storage
    const storedUserId = getItemWithFallback('userId');
    
    // Fetch user data from Firestore
    const {credibility, currentUserId, agentAccount, withdrawalPassword, walletBalance, walletAddress, completedTask, totalTasks, getIndexArray } = await fetchUserData(storedUserId);
    console.log(credibility, currentUserId)
    // Initialize screen width and create element
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;
    const element = document.createElement('div');

    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
        <div id="errorContainer" class="error-message"></div>
        <a id="whistory" href="/whistory" class='anchor-styles'>History</a>
        <div class="checkYou">
            <div class="wallet-amount">
                <p>Wallet Amount</p>
                <p class="amount">USDT <span>${walletBalance}</span></p>
            </div>
            <div class="withdraw-method">
                <h2>Withdraw Method</h2>
                <p class="prev">Withdraw will be transferred to Exchange Wallet</p>
            </div>
            <div class="withdraw-section">
                <label for="withdraw-amount" class="withdraw-amount">
                    <p class="pre">Withdraw</p>
                    <button class="withdraw-all-button" id="withdrawAll">ALL</button>
                </label>
                <div>
                    <input type="number" id="withdraw-amount" class="withdraw-input" placeholder="Type Withdraw Amount" required>
                </div>
            </div>
            <div class="security-pin">
                <label for="security-pin" class="pre">Withdrawal Password</label>
                <input type="password" id="security-pin" class="withdraw-input" placeholder="Type Security PIN" required>
            </div>
            <button class="large-btn login-btns" id="submit-withdraw">Withdraw</button>
        </div>
    `;

    // Event listeners
    const errorContainer = element.querySelector('#errorContainer');
    const usernameInput = element.querySelector("#withdraw-amount");
    const passwordInput = element.querySelector("#security-pin");
    const walletAmountElement = element.querySelector(".amount span");

    element.querySelector("#withdrawAll").addEventListener("click", () => {
        if (!checkInputHasValue(usernameInput)) {
            usernameInput.value = walletBalance;
        } else {
            console.log("E set");
        }
    });

    element.querySelector("#submit-withdraw").addEventListener("click", async () => {
        showLoader();

        if (walletAddress.trim() === '') {
            displayError('Bind wallet address first.', errorContainer, false);
            removeLoader();
            return;
        }
        const credibilityScore = credibility;
        
        console.log(typeof(credibilityScore))
        if (credibilityScore !== '100') {
            displayError('Contact Customer Service to update your Credibility Score.', errorContainer);
            removeLoader();
            return;
        }
        if(completedTask !== totalTasks){
            displayError('Please complete your tasks', errorContainer, false);
            removeLoader();
            return;
        }
        const walletAmount = parseFloat(walletBalance);

        if (walletAmount < 100) {
            displayError("The Minimum Withdrawal amount is 100 USDT", errorContainer, false);
            removeLoader();
            return;
        }

        if (!checkInputHasValue(usernameInput)) {
            displayError("Please Enter the Amount to proceed. Thanks", errorContainer, false);
            removeLoader();
            return;
        }

        const securityPinElement = passwordInput;
        if (!checkInputHasValue(securityPinElement)) {
            displayError("Please Enter your Security Pin to proceed. Thanks", errorContainer, false);
            removeLoader();
            return;
        }

        const securityPin = passwordInput.value;

        const withdrawalPin = withdrawalPassword;
        if (securityPin !== withdrawalPin) {
            displayError("Password not Match, Contact Customer Service If you have forgotten", errorContainer, false);
            removeLoader();
            return;
        }

        const withdrawAmount = parseFloat(usernameInput.value);
        if (withdrawAmount < 50) {
            displayError("Please Enter a Value Greater than 50", errorContainer);
            removeLoader();
            return;
        }

        const newWalletBalance = roundToTwoDecimals(walletAmount - withdrawAmount);
        if (newWalletBalance < 0) {
            displayError("Please withdraw within the limit of your account", errorContainer, false);
            removeLoader();
            return;
        }

        try {
            // get the index of the new array
            const index = getIndexArray.length;
            // Create a new withdrawal record object
            const withdrawalRecord = {
                username: storedUserId,
                id: currentUserId,
                transaction_id: index,
                agent_username: agentAccount,
                submission_time: new Date().toLocaleString(),
                wallet_address: walletAddress,
                withdrawal_amount: withdrawAmount,
                payment_method: '',
                amount_received: '',
                handling_fees: '',
                status: 'Pending'
            };

            // Perform Firestore transaction to add new record to the records array
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'members', currentUserId);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists) {
                    throw new Error('User document does not exist.');
                }

                const currentRecords = userDoc.data().withdrawal_information.records || [];
                const newRecords = [...currentRecords, withdrawalRecord];

                transaction.update(userRef, {
                    'withdrawal_information.records': newRecords,
                    'wallet_information.wallet_balance': newWalletBalance
                });

                return newRecords;
            });

            handleSuccessfulWithdrawal(walletAmountElement, usernameInput, passwordInput, newWalletBalance);

        } catch (error) {
            console.error("Error during withdrawal: ", error);
            displayError("Error processing withdrawal. Please try again later.", errorContainer, false);
        } finally {
            removeLoader();
        }
    });
    // element.querySelector('#whistory').addEventListener('click', ()=>{
    //     showLoaderAndNavigate('/whistory');
    // })
    
    // Navigation
    const navBottom = document.createElement('div');
    navBottom.className = 'nav-bottom';
    navBottom.style.width = `${finalWidth}px`;
    navBottom.innerHTML = `
        <div id="home">
            <img src=${optimize} alt="customer care">
            <h4>Home</h4>
        </div>
        <div id="startBtn">
            <img src=${home} alt="starting">
            <h4>Starting</h4>
        </div>
        <div id="records">
            <img src=${record} alt="customer care">
            <h4>Records</h4>
        </div>
    `;

    navBottom.querySelector('#home').addEventListener('click', () => {
        showLoaderAndNavigate('/home');
    });

    navBottom.querySelector('#startBtn').addEventListener('click', () => {
        showLoaderAndNavigate('/starting');
    });

    navBottom.querySelector('#records').addEventListener('click', () => {
        showLoaderAndNavigate('/records');
    });

    element.appendChild(navBottom);

    return element;
}

function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}


function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

function handleSuccessfulWithdrawal(walletAmountElement, usernameInput, passwordInput, newWalletBalance) {
    walletAmountElement.textContent = newWalletBalance;
    usernameInput.value = '';
    passwordInput.value = '';
    const errorContainer = document.querySelector('#errorContainer');
    displayError('Withdrawal Successful', errorContainer, false);
    removeLoader();
    setTimeout(() => {
        window.history.pushState({}, '', '/home');
        handleRoute();
    }, 2000);
}

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 500); // Simulate some loading time
}

function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

function checkInputHasValue(inputElement) {
    return inputElement.value.trim() !== '';
}

function displayError(message, element, isError = true) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.style.color = isError ? 'red' : 'green';
    removeLoader();
    setTimeout(() => {
        element.style.display = 'none';
    }, 4000);
}
