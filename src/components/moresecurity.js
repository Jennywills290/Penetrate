import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';
import { getFirestore, doc, getDoc, query, where, collection, getDocs, updateDoc } from 'firebase/firestore';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility functions
function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

// Fetch security PIN
async function fetchSecurityPin(storedUserId) {
    try {
        showLoader(); // Show loader at the beginning of the function
        const walletAddressesRef = collection(db, 'members');
        const q = query(walletAddressesRef, where('username', '==', storedUserId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const walletDoc = querySnapshot.docs[0];
            const walletInfo = walletDoc.data();
            const userId = walletDoc.id; // Corrected line
            const securityPin = walletInfo.password;
            removeLoader(); // Remove loader after the operation
            return [securityPin, userId];
        } else {
            console.error('No such document!');
            removeLoader(); // Remove loader in case of no document
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        removeLoader(); // Remove loader in case of error
        return null;
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

function checkInputHasValue(inputElement) {
    return inputElement.value.trim() !== '';
}

async function updateSecurityPin(userId, newPin) {
    const userDocRef = doc(db, 'members', userId);
    try {
        await updateDoc(userDocRef, {
            'password': newPin
        });
        console.log('Password successfully updated!');
    } catch (error) {
        console.error('Error updating security PIN:', error);
    }
}

export async function renderMorePassword() {
    // Retrieve userId (username) from session storage
    const storedUserId = getItemWithFallback('userId');
    console.log(storedUserId)
    const element = document.createElement('div');

    // Handle case where user data is not found
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;

    element.className = 'container pt-50';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
        <div id="errorContainer" class="error-message"></div>
        <div class="security-pin">
            <label for="oldsecurity-pin" class="pre p-b-3">Old  Password</label>
            <input type="password" id="oldsecurity-pin" class="withdraw-input" placeholder="Type Security PIN" required>
        </div>
        <div class="security-pin">
            <label for="newsecurity-pin" class="p-b-3 pre">New Password</label>
            <input type="password" id="newsecurity-pin" class="withdraw-input" placeholder="Type Security PIN" required>
        </div>
        <div class="security-pin">
            <label for="confirmsecurity-pin" class="pre p-b-3">Confirm New  Password</label>
            <input type="password" id="confirmsecurity-pin" class="withdraw-input" placeholder="Type Security PIN" required>
        </div>
        <button class="large-btn login-btns" id="submit-password">Submit</button>
    `;

    // Event listeners
    const errorContainer = element.querySelector('#errorContainer');
    const oldPasswordInput = element.querySelector("#oldsecurity-pin");
    const newPasswordInput = element.querySelector("#newsecurity-pin");
    const confirmPasswordInput = element.querySelector("#confirmsecurity-pin");
    const submitButton = element.querySelector("#submit-password");

    submitButton.addEventListener('click', async () => {
        const oldPassword = oldPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!checkInputHasValue(oldPasswordInput) || !checkInputHasValue(newPasswordInput) || !checkInputHasValue(confirmPasswordInput)) {
            displayError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            displayError('New passwords do not match');
            return;
        }

        const currentSecurityPin = await fetchSecurityPin(storedUserId);
        console.log(currentSecurityPin)
        if (currentSecurityPin[0] !== oldPassword) {
            displayError('Old security password is incorrect');
            return;
        }

        await updateSecurityPin(currentSecurityPin[1], newPassword);
        displayError('Passwrd successfully updated', false);
        oldPasswordInput.value ='';
        newPasswordInput.value ='';
        confirmPasswordInput.value = '';
        window.history.pushState({}, '', '/login');
        handleRoute();
    });

    function displayError(message, isError = true) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        errorContainer.style.color = isError ? 'red' : 'green';
        removeLoader();
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 4000);
    }

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

function showLoaderAndNavigate(path) {
    showLoader();
    setTimeout(() => {
        window.history.pushState({}, '', path);
        handleRoute();
        removeLoader();
    }, 500); // Simulate some loading time
}
