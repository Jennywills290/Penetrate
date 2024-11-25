import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import dollar from 'images/dollar.svg';
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

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 2000); // Small delay to ensure loader is visible
}

export async function renderTransaction() {
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;
    const storedUserId = getItemWithFallback('userId');

    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
        <div class="withdraw-sect wrapper"></div>
    `;

    const transactions = await fetchTransactions(storedUserId);
    displayTransactions(element, transactions);

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

async function fetchTransactions(storedUserId) {
    try {
        const membersRef = collection(db, 'members');
        const q = query(membersRef, where('username', '==', storedUserId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const memberDoc = querySnapshot.docs[0];
            const memberData = memberDoc.data();
            return memberData.mission_information.transactions;
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

function displayTransactions(element, transactions) {
    const withdrawSection = element.querySelector('.withdraw-sect');
    withdrawSection.innerHTML = ''; // Clear previous content

    transactions.forEach(transaction => {
        withdrawSection.innerHTML += `
            <div class="d-f br">
                <div><img src="${dollar}" alt="icon display"></div>
                <div class="d-f">
                    <div>
                        <h2>${transaction.name}</h2>
                        <p class="pre">${transaction.date}</p>
                    </div>
                    <p>${transaction.amount}</p>
                </div>
            </div>
        `;
    });
}
