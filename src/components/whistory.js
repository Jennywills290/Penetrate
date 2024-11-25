import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility functions
function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

async function fetchWithdrawalHistory(storedUserId) {
    try {
        const membersRef = collection(db, 'members');
        const q = query(membersRef, where('username', '==', storedUserId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const memberDoc = querySnapshot.docs[0];
            const memberData = memberDoc.data();
            const withdrawalHistory = memberData.withdrawal_information.records || []
            return withdrawalHistory
        } else {
            
            console.error('No such document!');
            return [];
        }
    } catch (error) {
        console.error('Error getting document:', error);
        removeLoader(); // Remove loader in case of error
        return [];
    }
}

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 800); // Small delay to ensure loader is visible
}

export async function renderWithdrawalHistory() {
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;
    const storedUserId = getItemWithFallback('userId');
    console.log(storedUserId);
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;

    const withdrawalHistory = await fetchWithdrawalHistory(storedUserId);
    console.log(withdrawalHistory);
   const resultfrom = displayTransactions(withdrawalHistory);

    element.appendChild(resultfrom);

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
            <img src=${records} alt="customer care">
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



function displayTransactions(withdrawals) {
    const withdrawSection = document.createElement('div');
    withdrawSection.className = 'withdraw-sect'
   // Clear previous content
    if(withdrawals){
        withdrawals.forEach(withdrawal => {
            withdrawSection.innerHTML += `
                <div class="d-f jc-sb br2">
                    <div>
                        <h2>USDT</h2>
                        <p>${withdrawal.submission_time}</p>
                    </div>
                    <div class="">
                        <p class="pre cop ${withdrawal.status == "Declined" ? "unsuccessful" : withdrawal.status == "Pending" ? "pending" : "completed"}">${withdrawal.status == "Declined" ? "-" : withdrawal.status == "Pending" ? "" : "+"} ${withdrawal.withdrawal_amount}</p>
                        <p class="">${withdrawal.status == "Declined" ? "Unsuccessful" : withdrawal.status == "Pending" ? "Pending" : "Completed"}</p>
                    </div>
                </div>
            `;
        });
    }
    return withdrawSection;
    
}
