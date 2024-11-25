import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);

function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

export function renderfaq(){
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
      
     <div class="faq" style="line-height:1.6; padding:40px 0px 160px">
        <h2 style="margin-bottom:20px; color:#ff5e29">Frequently Asked Questions</h2>
        <div>
            <h3>1. To deposit funds</h3>
            <br>
            <p class="pre">
                 With the massive amount of information on the platform, users should contact customer service to confirm and double-check the client's wallet address before each deposit.
            </p>
            <br>
            <p class="pre">
                After a successful deposit, users are requested to provide a successful transfer slip for online customer service to update the platform account.
            </p>
            <br>
            <p class="pre">
                The name of the recipient and the amount transferred must be the same as the wallet address provided for the payment to be effective immediately.
            </p>
            <br>
            <p class="pre">
                If the user encounters any problem during the deposit process, please contact our online customer service for more information!
            </p>
            <br><br>
             <h3>2. About Product prices</h3>
             <br>
             <p class="pre">
                The price of the products is randomly assigned based on the total balance on the user's account
            </p>
            <br>
            <p class="pre">
                The more the user account balance, the higher the price of the products, so the higher the profit.
            </p>
            <br>
            <p class="pre">
                If you're worried that the products package order amount is too expensive to afford, please don't deposit more amount to start.
            </p>
           <br><br>
            <h3>3. Withdrawal</h3>
             <br>
            <p class="pre">
                Withdrawal time is from 11:00 to 22:59 daily.
            </p>
            <br><br>
            <h3>4. Platform User Mode</h3>
            <br>
            <p class="pre">
                Users may invite new users to become platform users and will receive additional referral commissions. The referral fee is an additional 20%.
            </p>
            <br><br>
            <h3>5. Operating hours</h3>
            <br>
            <p class="pre">
                Users can start upgrading products data during the daily operating hours from 11:00 to 23:00.
            </p>
            <br>
            <p class="pre">
                Notice: For further explanation, please click "Contact Us" on the platform to contact our online customer service!
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