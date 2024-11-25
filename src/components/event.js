import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import events from 'images/events.jpg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);

function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

export function renderEvent(){
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.style.padding = `0px 15px 70px`;
    element.innerHTML = `
      
        <div class="faq" style="line-height:1.6; padding:0px 0px 40px">
        <h2 class="ta-c vip-heading">
            Events
        </h2>
        <img src="${events}" alt="npm events earnings" width="100%">
        <div>
            <br>
            <p class="pre">
                 As a platform user, you must work for 14 days or become a VIP3 user before you can use the invitation code to invite others to join your team. In return, the recommender will receive a certain percentage of the referral fee, which will be deposited directly to the user through the platform account or team report.
            </p>
            <br>
            <p class="pre">
                After a successful deposit, users are requested to provide a successful transfer slip for online customer service to update the platform account.
            </p>
            <br>
            <p style="color:#ff5e29; font-size:18px"><strong>Notice!</strong><br></p>
            <br>
        
             <h3>Non-Disclosure Agreement</h3>
             <p class="pre">
                Since the tasks to be completed on this platform are real-time data completed by real users. Therefore, users must ensure the confidentiality and platform integrity of orders.
            </p>
        </div>
     </div>

    `

    
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;

    const navBottom = document.createElement('div');
    navBottom.className = 'nav-bottom';
    navBottom.style.width = `${finalWidth}px`;
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
    navBottom.querySelector('#home').addEventListener('click', () => {
        showLoaderAndNavigate('/home');
    });
    navBottom.querySelector('#startBtn').addEventListener('click', (e) => {
    
        showLoaderAndNavigate('/starting');
    });
    navBottom.querySelector('#records').addEventListener('click', (e) => {
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
    }, 800); // Small delay to ensure loader is visible
}