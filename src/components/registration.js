import { handleRoute } from '../index';
import { getUserIp } from '../utils/utils';
import { initializeApp } from 'firebase/app';
import { getFirestore, query, where, collection, addDoc, getDocs } from 'firebase/firestore';
import logo from '../images/logo.png';
import globe from '../images/globe.svg';
import circle from '../images/Ellipse 15.png';
import DOMPurify from 'dompurify';
import firebaseConfig from '../firebaseConfig';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function renderRegister() {
    const element = document.createElement('div');
    element.className = 'container';
    element.innerHTML = `
        <nav>
            <div>
                <img src="${logo}" alt="Logo">
            </div>
            <div>
                <img src="${globe}" alt="Logo">
            </div>
        </nav>
        <div class="content-con w-100 d-fl ai-c">
            <div id="errorContainer" class="error-message"></div>
            <h2 class="login-form">You made it!</h2>
            <div class="underline"></div>
            <form class="reg-form">
                <div class="form-group">
                    <label for="username"></label>
                    <input type="text" id="username" name="username" placeholder="Username" required>
                </div>
                <div class="form-group" style="position: relative;">
                    <label for="password"></label>
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    <button class="password-toggle" id="togglePassword">Show</button>
                </div>
                <p class="passwordHint">Please use letters and numbers, and a minimum length of 6</p>
                <div class="form-group">
                    <label for="invitation"></label>
                    <input type="text" id="invitation" name="invitation" placeholder="Invitation Code" required>
                </div>
                <div class="form-group">
                    <label for="withdrawal"></label>
                    <input type="number" id="withdrawal" name="withdrawal" placeholder="Withdrawal Password" required>
                </div>
                <p class="passwordHint">Please  numbers, and a minimum length of 8</p>
                <div class="form-group">
                    <label for="pnumber"></label>
                    <input type="number" id="pnumber" name="pnumber" placeholder="Phone Number" required>
                </div>
                <div class="form-group">
                    <label for="agreement">
                        <input type="checkbox" id="agreement" name="agreement">
                    </label>
                    <button id="user-agreement" class="agreem" style="width:auto">
                        Agree With User Registration Agreement
                    </button>
                </div>
                <button type="submit" class="login-btns reg-btn large-btn">Register Now</button>
                <button type="button" class="login-btns small-btn regBtn secondary" id="loBtn">Login Now</button>
            </form>
        </div>
    `;
    function togglePasswordVisibility(event) {
        event.preventDefault(); // Prevent the form from submitting
        const passwordInput = document.getElementById('password');
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
        const passwordRegex = /^[a-zA-Z0-9]{8,}$/;
        return passwordRegex.test(password);
    }

    function isValidLength(input, minLength, maxLength) {
        return input.length >= minLength && input.length <= maxLength;
    }

    function validateNumber(number) {
        const numberRegex = /^\d{8}$/;
        return numberRegex.test(number);
    }

    function validateInput(username, password, withdrawalP) {
        if (!isValidLength(username, 3, 20)) {
            return { isValid: false, message: 'Username must be between 3 and 20 characters.' };
        }

        if (!isValidPassword(password)) {
            return { isValid: false, message: 'Password is invalid. It must be at least 8 characters long and contain only letters and digits.' };
        }

        if (!validateNumber(withdrawalP)) {
            return { isValid: false, message: 'Withdrawal Password is invalid. It must be at least 8 characters long and contain only digits.' };
        }

        return { isValid: true, message: 'All inputs are valid.' };
    }

    // Function to display error messages
    function displayError(message) {
        const errorContainer = element.querySelector('#errorContainer');
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        removeLoader();
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 4000);
    }
    
   
    // Function to check if username or phone number already exists
    async function checkUsernameAndPhone(username, pnumber) {
        const usernameQuery = query(collection(db, "members"), where("username", "==", username));
        const phoneQuery = query(collection(db, "members"), where("phone", "==", pnumber));
        const [usernameSnapshot, phoneSnapshot] = await Promise.all([getDocs(usernameQuery), getDocs(phoneQuery)]);
        
        if (!usernameSnapshot.empty) {
            throw new Error('Username already exists. Please use a different Username');
        }
        if (!phoneSnapshot.empty) {
            throw new Error('Phone number already exists. Please use a different Phone Number');
        }
    }

    // Function to check if the invitation code is valid
    async function checkInvitationCode(invitationCode) {
        const invitationQuery = query(
            collection(db, "members"),
            where("member_information.invitation_code", "==", invitationCode),
            where("member_information.type", "==", "agent")
        );
        const invitationSnapshot = await getDocs(invitationQuery);
        if (invitationSnapshot.empty) {
            throw new Error('Invalid Invitation Code. Please use a trainer Invitation Code');
        }
        return invitationSnapshot;
    }

    // Function to generate member data
    async function generateMemberData(username, password, pnumber, withdrawalP, ip, country, city, invitationSnapshot) {
        const supervisorDoc = invitationSnapshot.docs[0];
        const superiorUsername = supervisorDoc.data().username
        const supervisorIndex = invitationSnapshot.docs.findIndex(doc => doc.id === supervisorDoc.id) + 1;
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const newInvitationCode = generateInvitationCode();
        return {
            username: username,
            phone: pnumber,
            password: password,
            member_information: {
                type: 'Client',
                invitation_code: newInvitationCode,
                invitationCode_enabled: true,
                account_enable: true,
                reputation_points: '100',
                isLogin: false
            },
            superior_information: {
                direct_reporting_account: "SupervisorAccount",
                highest_superior_username: superiorUsername,
                direct_supervisor_id: supervisorDoc.id || 0,
                highest_level_account: supervisorIndex,
            },
            VIP_level: "vip1",
            profits: 0.5,
            wallet_information: {
                cumulative_recharge: 0,
                wallet_balance: 8,
                amount_in_transit: 0,
                frozen_amount: 0,
                cumulative_withdrawal: 0,
                withdrawal_password: withdrawalP,
                withdrawal_status: "Normal withdrawal"
            }, withdrawal_information:{
                records:[]
            },
            wallet_address_information:{
                address:'',
                date:'',
                reset:'',
                type:'',
            },
            mission_information: {
                completed: 0,
                total_tasks: 40,
                number_of_resets: 0,
                records: [],
                combination_active:false,
                combination: [],
                combinationNumber: 1,
                profits_earned: 0,
                todays_profits: 0,
                profits_last_updated: formattedDate,
                transactions: [],
                products_to_submit: []
            },
            registration_message: {
                ip_address: ip,
                address: city,
                country: country,
                date: formattedDate
            },
            login_information: {
                ip_address: "",
                date: "",
                allowed: true,
            },
            operate: {
                freeze_account: true,
                enable_invite: true,
                limit_withdrawal: false,
                change_login_password: false,
                change_withdrawal_password: false,
                order_settings: false,
                reset_today_task_volume: false
            }
        };
    }

    // Function to add member data to Firestore
    async function addMemberToFirestore(memberData) {
        await addDoc(collection(db, "members"), memberData);
    }

    // Function to handle successful registration
    function handleSuccessfulRegistration(errorContainer, regForm) {
        regForm.reset();
        window.history.pushState({}, '', '/login');
        handleRoute();
        displayError('User Registration Successful');
        removeLoader();
    }

    const regForm = element.querySelector('.reg-form');

    regForm.addEventListener('submit', async (event) => {
        event.preventDefault();
       const checkbox = document.getElementById('agreement');
        if (!checkbox.checked) {
            displayError('Seclect the checkBox and Continue');
            removeLoader();
            return
        }
        showLoader();

        // Extract and sanitize form values
        const username = sanitizeInput(regForm.username.value);
        const password = sanitizeInput(regForm.password.value);
        const pnumber = regForm.pnumber.value;
        const invitationCode = regForm.invitation.value;
        const withdrawalP = regForm.withdrawal.value;

        // Validate input
        const validation = validateInput(username, password, withdrawalP);
        if (!validation.isValid) {
            displayError(validation.message);
            return;
        }

        try {
            // Check if username or phone number already exists
            await checkUsernameAndPhone(username, pnumber);

            // Check if the invitation code is valid
            const invitationSnapshot = await checkInvitationCode(invitationCode);

            // Get user IP information
            const { ip, country, city } = await getUserIp();

            // Generate member data
            const memberData = await generateMemberData(username, password, pnumber, withdrawalP, ip, country, city, invitationSnapshot);

            // Add member data to Firestore
            await addMemberToFirestore(memberData);

            // Registration success
            handleSuccessfulRegistration(element.querySelector('#errorContainer'), regForm);
        } catch (error) {
            displayError(error.message);
        }
    });

    element.querySelector('#loBtn').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/login');
        handleRoute();
    });

    element.querySelector('#user-agreement').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/agreement');
        handleRoute();
    });

    function generateInvitationCode(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let invitationCode = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            invitationCode += characters[randomIndex];
        }
        
        return invitationCode;
    }
    

    return element;
}
