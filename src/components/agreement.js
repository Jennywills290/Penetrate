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

export function renderAgreement(){
    const screenWidth = getScreenWidth();
    const finalWidth = screenWidth > 430 ? '430' : screenWidth;
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.style.padding = `0px 15px 70px`;
    element.innerHTML = `
        <nav>
            <button id="registration">
                <h4><< &nbsp; Registration</h4>
            </button>
        </nav>
        <div class="faq" style="line-height:1.6; padding:40px 0px">
        <h2 style="margin-bottom:20px; color:#ff5e29">User Registration Agreement</h2>
        <p>Welcome to NP Digital and its services!</p>
        <br/>
        <p>In order to protect the security of this website and the Creator's software ("Software Use and Services"), you should read the following "Software and Services License" ("Software" or "Agreement"). You need to fully understand the terms and conditions, particularly the terms of service and restrictions, and the separate agreements for each term, and accept or reject liability.</p>
        <br/>
        <p>If you are 18 years of age or older, becoming a user of this website means that you have read and agreed to this agreement and related terms and conditions, otherwise you have no right to download, install software and enjoy services.</p>
        <br/>
        <div style="line-height:1.6">
            <h3> (1) Protection of users’ personal information</h3>
            <br>
            <p class="pre">
                 <strong>1.1</strong> Protecting users’ personal information and creator information is the basic principle of this website. All information at NP Digital uses professional encrypted storage and transmission channels to ensure user security. If information is leaked without the consent of the original text, this site will be held legally responsible.
            </p>
            <p class="pre">
               <strong>1.2</strong> In the process of using this service, users need to provide some necessary information. For example, in order to register for an account, users need to fill in their mobile phone number and agree to the relevant terms and conditions of use. If the information provided by user is incomplete, the user may be restricted during use.
            </p>
            <p class="pre">
               <strong>1.3</strong> Under normal circumstances, users can modify submitted data at any time. For security reasons (such as account retrieval services), users may not be able to change their personal information at will after registration.
            </p>
            <p class="pre">
               <strong>1.4</strong> NP Digital adopts various security technologies and procedures and has a complete management system to protect users' personal information. Any use or unauthorized use at any time will be subject to legal proceedings. The final registered mobile phone number for new NP Digital accounts and existing NP Digital accounts may not be changed at will.
            </p>
            <p class="pre">
               <strong>1.5</strong> Under no circumstances will NP Digital disclose user information to companies and organizations other than NP Digital without the user's consent.
            </p>
            <p class="pre"> <strong>1.6</strong> For persons under the age of 18, written information from a parent or law enforcement official is required before accessing the services of this website</p>

           <br><br>
            <h3>IV. Account Security</h3>
             <br>
            <p class="pre">
                <strong>2.1</strong> Users need to complete a set of orders before they can apply for currency withdrawal.
            </p>
            <p class="pre">
               <strong>2.2</strong> Users cannot withdraw cash while the order is in progress.
            </p>
            <p class="pre">
                <strong>2.3</strong> The user cannot cancel or skip the order.
            </p>
            <p class="pre">
                <strong>2.4</strong> Unofficial Users who have not been working for 14 days are required to pay their own tax on withdrawals exceeding 20,000 USDT in a single installment. The tax is 20% of the account balance and will be refunded to the User immediately after the payment.
            </p>
           <p class="pre"> <strong>2.5</strong> Users with more than 60,000 USDT in their accounts with less than 14 days of accumulated work sign-in are required to deposit a 10% credit deposit, which will be returned to their accounts after the users have accumulated work for 14 days.
           </p>
           <p class="pre"> <strong>2.6</strong> Non-official users whose work check-in accumulation days do not reach 7 days and whose account balance exceeds 10,000 USDT will need to pay a fee for managing account funds security, which is 30% of the account balance and will be refunded to the user 7 days after payment.
           </p>
          
            <br><br>
            <h3>Terms and Conditions</h3>
            <br>
            <p class="pre">
                <strong> 3.1 Agreement</strong> The user contract and service terms are subject to the terms stipulated on the account. The user should provide relevant information and documents to this website. The user is an attachment to the contract terms.
            </p>
            <p class="pre">
                <strong>3.2</strong> This website provides services to all users in accordance with these Terms. If you have any questions or other important concerns, please contact the department for feedback.
            </p>
            
        </div>
     </div>

    `
    element.querySelector('#registration').addEventListener('click', () => {
        showLoaderAndNavigate('/register');
    });
    
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

