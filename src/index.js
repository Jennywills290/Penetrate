import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { showLoader, removeLoader } from './components/loader';
import { renderHome } from './components/home';
import { renderLogin } from './components/login';
import { renderRegister } from './components/registration';
import { renderAbout } from './components/about';
import { renderCertificate } from './components/certificate';
import { renderEvent } from './components/event';
import { renderfaq } from './components/faq';
import { renderRecords } from './components/records';
import { renderPersonal } from './components/personal';
import { renderStartPage } from './components/startpage';
import { renderTandC } from './components/tandc';
import { renderTransaction} from './components/transaction';
import { renderDeposit } from './components/deposit';
import { renderWithdrawal } from './components/withdrawal';
import { renderWithdrawalHistory } from './components/whistory';
import { renderproducts } from './components/products';
import { renderSecurityPassword } from './components/security';
import { renderMorePassword } from './components/moresecurity';
import { renderRecognition } from './components/recognition';
import { renderAgreement } from './components/agreement';
import { renderWalletBind } from './components/wallet';
import './components/styles/styles.css';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const routes = {
    '/login': renderLogin,
    '/register': renderRegister,
    '/agreement': renderAgreement,
    '/home': () => checkLoginStatus() && renderHome(),
    '/event': () => checkLoginStatus() && renderEvent(),
    '/products': () => checkLoginStatus() && renderproducts(),
    '/faq': () => checkLoginStatus() && renderfaq(),
    '/t&c': () => checkLoginStatus() && renderTandC(),
    '/transaction': () => checkLoginStatus() && renderTransaction(),
    '/starting': () => checkLoginStatus() && renderStartPage(),
    '/personal': () => checkLoginStatus() && renderPersonal(),
    '/about': () => checkLoginStatus() && renderAbout(),
    '/certificate': () => checkLoginStatus() && renderCertificate(),
    '/records': () => checkLoginStatus() && renderRecords(),
    '/deposit': () => checkLoginStatus() && renderDeposit(),
    '/withdrawal': () => checkLoginStatus() && renderWithdrawal(),
    '/whistory': () => checkLoginStatus() && renderWithdrawalHistory(),
    '/moresecurity': () => checkLoginStatus() && renderMorePassword(),
    '/security': () => checkLoginStatus() && renderSecurityPassword(),
     '/recognition': () => checkLoginStatus() && renderRecognition(),
     '/wallet': () => checkLoginStatus() && renderWalletBind(),
};

function checkLoginStatus() {
    const username = sessionStorage.getItem('userId');
    if (!username) {
        // Redirect to login page if user is not logged in
        window.location.href = '/login';
        return false;
    }
    return true;
}

async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}

function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

const screenWidth = getScreenWidth();
const finalWidth = screenWidth > 430 ? '430' : screenWidth;

async function loadComponent(component) {
    showLoader(); // Show the loader before loading the component
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ``;
    contentDiv.style.width = `${finalWidth}px`;
    try {
        const element = await component(); // Await the component if it's a promise
        contentDiv.appendChild(element);
    } catch (error) {
        console.error('Error loading component:', error);
    } finally {
        removeLoader(); // Hide the loader after the component
    }
}

export function handleRoute() {
    const path = window.location.pathname;
    const component = routes[path] || renderLogin; // Default to loginComponent

    // Check if the user is logged in before rendering protected routes
    const protectedRoutes = ['/home', '/event', '/products', '/faq', '/t&c', '/wallet','/transaction', '/starting', '/personal', '/about', '/recognition', '/deposit', '/records', '/withdrawal', '/whistory', '/moresecurity', '/security'];
    if (protectedRoutes.includes(path) && !checkLoginStatus()) {
        return; // If not logged in, the user will be redirected to the login page
    }

    if (component) {
        loadComponent(component);
    } else {
        document.getElementById('content').innerHTML = '<h1>404 - Page Not Found</h1>';
    }
}

// Retrieve the selected language from localStorage
const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

   //Handle back/forward navigation
     window.addEventListener('popstate', (event) => {
         // Clear session storage and local storage
         localStorage.clear();
         // Redirect to the login page
         window.location.href = '/login';
         handleRoute()
     });

window.addEventListener('load', ()=>{
    handleRoute();
})

// window.addEventListener('beforeunload', () => {
//     // Clear session storage and local storage
//     sessionStorage.clear();
//     // Redirect to the login page
//     
// });


  

// Optional: Add a click listener to links to handle navigation without reloading the page
document.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        if (href) {
            history.pushState(null, '', href);
            handleRoute();
        }
    }
});
