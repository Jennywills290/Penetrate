import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { updateProductsInFirestore } from 'utils/updateStore';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';
import { getFirestore, doc, getDoc, query, where, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

async function fetchUserData(username) {
    try {
        showLoader(); // Show loader at the beginning of the function
        const usersRef = collection(db, 'members');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id; 
            const userData = userDoc.data();
            // Correctly getting the user ID from Firestore
            return [userId, userData];
        } else {
            console.error('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        return null;
    } finally {
        removeLoader(); // Remove loader in case of error or no document
    }
}

function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

function setItemWithFallback(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        localStorage.setItem(key, value);
    }
}

function checkInputHasValue(inputElement) {
    return inputElement.trim() !== '';
}

function displayError(message, isError = true) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.style.color = isError ? 'red' : 'green';
    removeLoader();
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 800);
}

async function checkWalletData(userData, walletAddressInput) {
    if (userData && userData.wallet_address_information) {
        const { address, reset } = userData.wallet_address_information;
        if (reset && address.trim() !== '') {
            walletAddressInput.value = address;
            walletAddressInput.setAttribute('readonly', 'readonly');
        }
    }
}

async function handleWalletSubmission(walletAddressInput, userId, userData) {
    showLoader();
    const walletAddress = walletAddressInput.value;
    await checkWalletData(userData, walletAddressInput);

    if (userData.wallet_address_information && userData.wallet_address_information.reset) {
        displayError("Wallet address has already been set and cannot be changed. Contact CS", true);
        return;
    }

    if (!checkInputHasValue(walletAddress)) {
        displayError("Please Enter a USDT Tether Wallet Address", true);
        return;
    }

    const walletData = {
        'wallet_address_information.type': "TRC-20/ERC-20",
        'wallet_address_information.address': walletAddress,
        'wallet_address_information.reset': true,
        'wallet_address_information.date': new Date().toLocaleString(),
    };

    try {
        await updateProductsInFirestore(userId, walletData);
        displayError('Wallet address has been binded Successfully', false)
        walletAddressInput.setAttribute('readonly', 'readonly'); // Make the input readonly
    } catch (e) {
        console.error('Error adding document: ', e);
    } finally {
        removeLoader();
    }
}

export async function renderWalletBind() {
    const element = document.createElement('div');
    element.className = 'container p-70';
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430px' : `${screenWidth}px`;
    element.style.width = finalWidth;
    element.innerHTML = `
    <div id="errorContainer" class="error-message"></div>
        <div class="wallet-bind-container">
            <h2>Wallet Bind</h2>
            <label for="wallet_address">Address:</label>
            <textarea placeholder="Please Enter Your Wallet Address" id="wallet_bind" class="wallet_bind"></textarea>
            <button class="large-btn login-btns" id="wallet_id">Submit</button>
        </div>
    `;

    const walletAddressInput = element.querySelector("#wallet_bind");
    const submitButton = element.querySelector("#wallet_id");

    // Fetch user ID
    const storedUserId = getItemWithFallback('userId');
    const userIdData = await fetchUserData(storedUserId);
    if (!userIdData) return; // Stop if user data couldn't be fetched
    const [userId, userData] = userIdData;

    // Fetch wallet data from Firestore
    await checkWalletData(userData, walletAddressInput);

    submitButton.addEventListener("click", () => handleWalletSubmission(walletAddressInput, userId, userData));

    const navBottom = document.createElement('div');
    navBottom.className = 'nav-bottom';
    navBottom.style.width = finalWidth;
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

    navBottom.querySelector('#home').addEventListener('click', () => showLoaderAndNavigate('/home'));
    navBottom.querySelector('#startBtn').addEventListener('click', () => showLoaderAndNavigate('/starting'));
    navBottom.querySelector('#records').addEventListener('click', () => showLoaderAndNavigate('/records'));
    element.appendChild(navBottom);

    return element;
}

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 400); // Small delay to ensure loader is visible
}
