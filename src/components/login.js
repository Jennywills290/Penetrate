import { getUserIp } from '../utils/utils';
import { handleRoute } from '../index';
import logo from '../images/logo.png';
import globe from '../images/globe.svg';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, where, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';
import DOMPurify from 'dompurify';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchCustomerService() {
    try {
        const supportsCollectionRef = collection(db, 'supports');
        const q = query(supportsCollectionRef); // Create a query to fetch all documents
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const supportData = querySnapshot.docs.map(doc => doc.data()); // Adjust according to your data structure
            ; // Adjust according to your data structure
            return supportData;
        } else {
            console.error('No phone numbers found!');
            return [];
        }
    } catch (error) {
        console.error('Error getting phone numbers:', error);
        return [];
    }
}


export function renderLogin() {
    const element = document.createElement('div');
    element.className = 'container';
    element.innerHTML = `
    <nav>
        <div>
            <img src="${logo}" alt="Logo">
        </div>
        <div style="position:relative;cursor:pointer">
            <div id="languageImage">
                <img src="${globe}" alt="Logo">
            </div>
            <div id="languageDropdown" class="dropdownmenu">
                <div class="language-option" data-lang="en">English</div>
                <div class="language-option" data-lang="de">German</div>
            </div>
        </div>
    </nav>
    <div class="content-con d-fl pt-50">
        <div id="errorContainer" class="error-message"></div>
        <h2 class="login-form">You made it!</h2>
        <div class="underline"></div>
        <form id="loginForm">   
            <div class="form-group">
                <label for="login-username"></label>
                <input type="text" id="login-username" name="login-username" placeholder="Type your Username" required>
            </div>
            <div class="form-group" style="position: relative;">
                <label for="password"></label>
                <input type="password" id="login-password" name="password" placeholder="Password" required>
                <button class="password-toggle" id="togglePassword">Show</button>
            </div>
            <button class="forgot-password" id="forgot-password">Forgot password?</button>
            <div class="sub-btn">
                <button type="submit" class="login-btns large-btn">Login Now</button>
                <button type="button" class="login-btns small-btn regBtn secondary" id="regBtn">Register Now</button>
            </div>
        </form>
    </div>
    <div class="com-overlayLoader">
        <div class="c-modal-body home-p cs-home">
            <div class="cs-wrapper" id="cs-wrapper">
            
            </div>
            <button class="login-btns small-btn canBtn secondary"  id="cancelBtn">Cancel</button>
        </div>
    </div>
    `;
    element.querySelector('#forgot-password').addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const supports = await fetchCustomerService();
        const csWrapper = document.querySelector('.cs-wrapper');
        csWrapper.innerHTML = '';
    
        supports.forEach((support, index) => {
            const button = document.createElement('button');
            button.className = 'login-btns large-btn csBtn';
            button.dataset.phoneNumber = support.phone_number
            button.dataset.phonePlatform = support.phone_platform;
            button.textContent = `${support.phone_title}`;
            csWrapper.appendChild(button);
    
            button.addEventListener('click', () => {
                const phonePlatform = button.dataset.phonePlatform;
                const phoneNumber = button.dataset.phoneNumber;
                if (phoneNumber) {
                    let waUrl; 
                    // check platform
                    if(phonePlatform === 'whatsapp'){
                         waUrl = `https://wa.me/${phoneNumber}`;
                    }else{
                        waUrl = `https://t.me/${phoneNumber}`;
                    }
                       
                    window.location.href = waUrl;
                } else {
                    alert('Unable to fetch customer service phone number.');
                }
            });
        });
    
        removeLoader();
        document.querySelector('.com-overlayLoader').classList.add('visible');
    });

  
    // Add event listener to the Cancel button to hide the modal and overlay
element.querySelector('#cancelBtn').addEventListener('click', () => {
    const overlayLoader = document.querySelector('.com-overlayLoader');
    overlayLoader.classList.remove('visible');
});
    element.querySelector('#languageImage').addEventListener('click', () => {
        console.log('apartee')
        const dropdown = document.querySelector('#languageDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Add event listeners to the language options
    const languageOptions = element.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const selectedLanguage = event.target.getAttribute('data-lang');
            localStorage.setItem('selectedLanguage', selectedLanguage);
            const dropdown = document.querySelector('#languageDropdown');
            dropdown.style.display = 'none';
            //updateLanguage(selectedLanguage);
        });
    });
  
    



    function togglePasswordVisibility(event) {
        event.stopPropagation();
        event.preventDefault();
        const passwordInput = document.getElementById('login-password');
        const passwordToggle = document.getElementById('togglePassword');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            passwordToggle.textContent = 'Show';
        }
    }

    element.querySelector('#togglePassword').addEventListener('click', togglePasswordVisibility);

    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
    }

    function isValidPassword(password) {
        const passwordRegex = /^[a-zA-Z0-9]{6,}$/;
        return passwordRegex.test(password);
    }

    function isValidLength(input, minLength, maxLength) {
        return input.length >= minLength && input.length <= maxLength;
    }

    function validateInput(username, password) {
        if (!isValidLength(username, 3, 20)) {
            return { isValid: false, message: 'Username must be between 3 and 20 characters.' };
        }

        if (!isValidPassword(password)) {
            return { isValid: false, message: 'Your password must be at least 6 characters long and contain only letters and numbers.' };
        }

        return { isValid: true, message: 'All inputs are valid.' };
    }

    function setItemWithFallback(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (error) {
            console.error('Session storage not available. Using local storage as fallback.');
            localStorage.setItem(key, value);
        }
    }

    element.querySelector('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorContainer = document.getElementById('errorContainer');
        const username = sanitizeInput(document.getElementById('login-username').value);
        const password = sanitizeInput(document.getElementById('login-password').value);
        const loader = document.querySelector('.overlayLoader');
        
        showLoader();

        let ip = 'Unknown';
        let country = 'Unknown';
        let region = 'Unknown';
        let city = 'Unknown';

        try {
            const ipData = await getUserIp();
            ip = ipData.ip;
            country = ipData.country;
            region = ipData.region;
            city = ipData.city;
        } catch (error) {
            console.error('Error fetching IP:', error);
        }

        const validation = validateInput(username, password);

        if (!validation.isValid) {
            errorContainer.textContent = validation.message;
            errorContainer.style.display = 'block';
            removeLoader();
        } else {
            errorContainer.style.display = 'none';
            const usersRef = collection(db, 'members');
            const q = query(usersRef, where('username', '==', username));
            getDocs(q)
                .then((querySnapshot) => {
                    let userDoc = null;
                    querySnapshot.forEach((doc) => {
                        if (doc.exists()) {
                            userDoc = doc;
                        }
                    });

                    if (userDoc) {
                        const userData = userDoc.data();
                        const userLoginCheck = userData.login_information.allowed
                         console.log(userLoginCheck);
                         if(!userLoginCheck){
                             removeLoader();
                             errorContainer.style.display = "block";
                             errorContainer.textContent = "Contact Trainer!";
                             return
                         }

                        if (userData.password === password) {
                            const userDocRef = doc(db, 'members', userDoc.id);
                            const now = new Date();
                            const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                            updateDoc(userDocRef, {
                                'member_information.isLogin': true ? false : true,
                                'login_information.ip': ip,
                                'login_information.date': formattedDate,
                                'login_information.ip_address': city
                            }).then(() => {
                                console.log('User login status and details updated successfully');
                            }).catch((error) => {
                                console.error('Error updating user details:', error);
                            });

                            element.querySelector('#loginForm').reset();
                            element.querySelector('#loginForm').style.display = 'none';
                            const userId = userData.username;
                            setItemWithFallback('userId', userId);

                            const loginsRef = collection(db, 'logins');
                            addDoc(loginsRef, {
                                userId: userId,
                                ip: ip,
                                country: country,
                                region: region,
                                city: city,
                                date: formattedDate
                            }).then(() => {
                                console.log('Login information stored successfully');
                            }).catch((error) => {
                                console.error('Error storing login information:', error);
                            });

                            removeLoader();
                            window.history.pushState({}, '', '/home');
                            handleRoute();
                        } else {
                            errorContainer.style.display = "block";
                            errorContainer.textContent = "Password not correct!";
                            removeLoader();
                        }
                    } else {
                        errorContainer.style.display = "block";
                        errorContainer.textContent = "User not found!";
                        removeLoader();
                    }
                })
                .catch((error) => {
                    console.error('Error logging in:', error);
                    alert('An error occurred. Please try again.');
                    removeLoader();
                });
        }
    });

    element.querySelector('#regBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/register');
        handleRoute();
    });

    return element;
}
