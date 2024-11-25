import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);

function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

export function renderTandC(){
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.style.padding = `0px 15px 70px`;
    element.innerHTML = `
      
        <div class="faq" style="line-height:1.6; padding:40px 0px">
        <h2 style="margin-bottom:20px; color:#ff5e29">Terms And Conditions</h2>
        <p>Every user is obliged to read and fulfill the terms and obligations</p>
        <br>
        <div>
            <h3>I. Products Upgrade</h3>
            <br>
            <p class="pre">
                 1.1) Reset requires a minimum deposit of 100 USDT
            </p>
            <p class="pre">
               1.2) After completing all orders, the user should apply for full withdrawal and receive the withdrawal amount before requesting to reset.
            </p>
            <p class="pre">
                The name of the recipient and the amount transferred must be the same as the wallet address provided for the payment to be effective immediately.
            </p>
            <br>
            <br>
            <h3>II. Withdrawal</h3>
            <br>
            <p class="pre">
               2.1) The maximum withdrawal amount for VIP Level 1 users is 3,000 USDT, and the maximum withdrawal amount for VIP Level 2 users is 5,000 USDT. There is no maximum withdrawal limit for VIP3-VIP5 users.
            </p>
            <p class="pre">
               2.2) After completing all orders, users can apply for full withdrawal.
            </p>
            <p class="pre">
                2.3) No withdrawal or refund is allowed during order execution.
            </p>
            <p class="pre"> 2.4) Users need to submit a currency withdrawal request to the platform to receive payment.</p>
            <br><br>
             <h3>III. Funds</h3>
             <br>
             <p class="pre">
                3.1)  All the user's funds will be safely stored in the user's account, and full withdrawal can be requested after the order is completed.
            </p>
   
            <p class="pre">
                3.2) To avoid loss of funds, all funds are processed by the system rather than manually.
            </p>

            <p class="pre">
                3.3) If there is an unexpected loss of funds, the platform will bear full responsibility.
            </p>
           <br><br>
            <h3>IV. Account Security</h3>
             <br>
            <p class="pre">
                4.1) Please do not divulge any passwords to others, if this results in any loss, the platform will not be responsible.
            </p>
            <p class="pre">
                4.2) Users are not recommended to set their birthday password, ID card number, or cell phone number as withdrawal password or login password.
            </p>
            <p class="pre">
                4.3) Login password or withdrawal password may be reset by contacting online customer service if forgotten.
            </p>
            <p class="pre">
                4.4) User and Business Non-Disclosure Agreement
            </p>
           <p class="pre"> 4.4.1) Orders completed by this platform require real-time data provided by real users. Therefore, users must ensure the confidentiality of tasks and the integrity of the platform.
           </p>
           <p class="pre"> 4.4.2) The workbench will regularly clear out low-level credit users who are unable to perform work for a long time/or the account will be handed over to the partner merchant for processing.
           </p>
           <p class="pre"> 4.5) Users with excessive funds in their accounts must apply for a dedicated channel to withdraw.
           </p>
            <br><br>
            <h3>V. Order</h3>
            <br>
            <p class="pre">
                5.1) VIP 1 will receive 0.5% for each order. VIP 2 will receive 1% per each order.
            </p>
            <p class="pre">
                5.2) VIP 3 will receive 1.5% remuneration for each order. VIP 4 will get paid 2% for each order.
                VIP 5 will get paid 2.5% for each order.
            </p>
            <p class="pre">
                5.3) After each order is completed, funds and rewards will be returned to the user's account on the spot.
            </p>
            <p class="pre">
                5.4) The system will randomly allocate orders to user accounts based on the total amount of the user account.
            </p>
            <p class="pre">
                5.5) Once an order is assigned to the User's account, it cannot be cancelled or skipped.
            </p>
            <p class="pre">
                5.6) In order to protect the interests of users, the application amount will increase according to the total account balance, and the income will also increase!
            </p>
            <br><br>
            <h3>VI. Products package order</h3>
            <br>
            <p class="pre">
                6.1) Products package orders are randomly matched by the system. Each product package order consists of 1-3 Products, and users have a higher chance of getting 1-2 Product packages in a Products package order.
            </p>
           <p  class="pre">6.2) VIP 1 Products package orders can get 10% for each order. VIP 2 Products package bookings earn 10% per booking.</p>
           <p class="pre">6.3) 10% can be earned for each task on VIP 3 Products package orders. Get 10% per task on VIP 4 and 5Products package orders.</p>
           <p class="pre">6.4) After the user receives the Products package order, the funds will not be returned to the account immediately, but will only be returned to the account after completing each order in the package.</p>
           <p class="pre">6.5) The system will randomly allocate Products package orders to the user account based on the total balance range of the user account.</p>
           <p class="pre">6.6) All orders cannot be cancelled or skipped once assigned to a user account.</p>
             <br><br>
            <h3>VII. The deposit</h3>
            <br>
            <p class="pre">
               7.1) When the amount of deposit in the account reaches the standard for upgrading the VIP level, the system detects and automatically upgrades your level without applying.
            </p>
            <p class="pre">
                7.2) The amount of deposit is the user's choice, we cannot decide the amount of deposit for the user, we suggest the user deposit according to their ability or after being familiar with the platform.
            </p>
            <p class="pre">
                7.3)If the user needs to recharge for a package order, we recommend that the user recharge according to the negative number displayed on the account.
            </p>
            <p class="pre">
                7.4) Before making a deposit, the user must request and confirm the wallet address from the on-line customer service.
            </p>
            <p class="pre">
               7.5) If the user deposits to the wrong wallet address, the platform will not be held responsible for any loss.
            </p>
             <br><br>
            <h3>VIII. Products Order System</h3>
            <br>
            <p class="pre">
                8.1) The platform will update different Products every minute. Products that have not been upgraded for a long time will cause the data to be unable to be uploaded to the system. To protect the developer's credibility, users are required to complete the task within 8 hours. Otherwise, it may lead to complaints from products merchants, and the order will be frozen!
            </p>
            <p class="pre">
                8.2) Customer service will provide a wallet address for users to make deposits.
            </p>
             <br><br>
            <h3>IX. Invitation</h3>
            <br>
            <p class="pre">
                9.1) After upgrading to a VIP 3 member, can use the invitation code to invite other users.
            </p>
            <p class="pre">
                9.2) If the account has not completed all products orders, the user will not be able to invite other users.
            </p>
            <p class="pre">
                9.3) The referrer will receive a 20% referral commission.
            </p>
            <br><br>
            <h3>X. Operation time</h3>
            <br>
            <p class="pre">
               10.1) Platform operating hours 11:00 to 22:59
            </p>
            <p class="pre">
                10.2) On-line customer service operating hours 11:00 to 22:59
            </p>
            <p class="pre">
                10.3) Platform withdrawal time 11:00 to 22:59
            </p>
            
            <br><br>
            <h3>XI. Credibility Values</h3>
            <br>
            <p class="pre">
               11.1) Credibility value ensures that the user completes the specified task within a specific time frame and if the user fails, it will be deducted.
            </p>
            <p class="pre">
                11.2) Withdrawal of funds requires a credibility value of 100% to be withdrawn.
            </p>
            <p class="pre">
                11.3) The reputation value is automatically detected by the system. If the reputation value is lower than 100%, you need to contact on-line CS consultation to restore the reputation value.
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

