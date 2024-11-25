import { handleRoute } from '../index';
import logo from '../images/logo.png';
import hamburger from '../images/hamburger.png';
import show from 'images/show.jpg';
import profile from 'images/profile.svg';
import shopping from 'images/shopping.svg';
import dollar from 'images/dollar.svg';
import wallet from 'images/wallet.svg';
import customer from 'images/customer.svg';
import certificate from 'images/certificate.svg';
import withdraw from 'images/Withdraw.svg';
import deposit from 'images/deposit.svg';
import tc from 'images/tc.svg';
import event from 'images/event.svg';
import FAQ from 'images/FAQ.svg';
import about from 'images/about.svg';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import copy from 'images/copy.svg';
import forward from 'images/forward.svg';
import transaction from 'images/transactin.png';
import logout from 'images/logout.svg';
import welcomeImg from 'images/salary.jpg';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc, query, where, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';
import { showLoader, removeLoader } from './loader';
import { getStorage, ref, uploadBytes, getDownloadURL,} from 'firebase/storage';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

async function fetchUserData(username) {
    try {
        const usersRef = collection(db, 'members');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            sessionStorage.setItem('userData', JSON.stringify(userData));
            return userData;
        } else {
            console.error('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        return null;
    }
}




function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

const screenWidth = getScreenWidth();
const finalWidth = screenWidth > 430 ? '430' : screenWidth;

export async function renderHome() {
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
    <div id="sideMenu" class="side-menu">
        <div class="menu-content">
            <span id="closeBtn" class="close-btn">&times;</span>
            <!-- Menu content here -->
            <div class="profile">
                <div class="ta-c" id="invitationCodeNumber">
                    <h4 class="" id="profileN">Chikko</h4>
                    <p>
                        INVITATION CODE: <span id="invitationCodeSpan">12345698
                            <img src="${copy}" alt=""/>
                        </span>
                    </p>
                </div>

                 <div class="credibility w-color">
                        <div class="d-f gap-1 ai-c">
                            <span class="fs-14"> Credit Score:</span>
                            <div class="range-container">
                                <div class="range">
                                    <span class="range-ind">
                                    </span>
                                    <span class="thumb">100%</span>
                                </div>
                            </div>
                        </div>
                    </div> 

            </div>
            <div class="earnings">
                <div class="ul-con">
                <div class="wallet-box border-1">
                    <div class="pt-b-12 d-f jc-sb">
                        <h4 class="pre p-c">Wallet Amount</h4>
                        <p class="p-c f-w-600" id="s-wa"></p>
                    </div>
                    <p class="mt-8" style="font-size:13px">The system will automatically update your Earnings</p>
                </div>
                </div>
            </div>
            <div class="ul-con ta-c">
                <img src="${logo}" alt="Company Logo">
            </div>
            <div class="ul-con">
                <ul class="menu-items">
                    <li class="" id="s-deposit">
                        <button href="#" class="">
                            <div class="d-f jc-sb ai-c">
                                <div class="d-f ai-c g-25">
                                <div class="sw-s">
                                    <img src="${deposit}" alt="icon for Deposit"/>
                                </div>
                                    <p class="p s-c">Deposit</p>
                                </div>
                                <img src="${forward}" alt="forward nav"/>
                            </div>
                        </button>
                    </li>
                    <li id="personal">
                        <button href="#" class=" tw-nw">
                        <div class="d-f jc-sb ai-c">
                            <div class="d-f ai-c g-25">
                            <div class="sw-s">
                                <img src="${profile}" alt="icon for Personal Info"/>
                            </div>
                                <p class="p s-c">Personal Info</p>
                            </div>
                            <img src="${forward}" alt="forward nav"/>
                        </div>
                        </button>
                    </li>
                    <li id="s-transaction">
                        <button href="#" class="">
                            <div class="d-f jc-sb ai-c">
                                <div class="d-f ai-c g-25">
                                <div class="sw-s">
                                    <img src="${transaction}" alt="icon for Transactions" class=>
                                </div>
                                    <p class="p s-c">Transactions</p>
                                </div>
                                <img src="${forward}" alt="forward nav"/>
                            </div>
                        </button>
                    </li>
                    <li id="s-wallet">
                        <button href="#" class="">
                        <div class="d-f jc-sb ai-c">
                            <div class="d-f ai-c g-25">
                                <div class="sw-s">
                                    <img src="${wallet}" alt="icon for Wallet" class=""/>
                                </div>
                                <p class="p s-c">Bind Wallet</p>
                            </div>
                            <img src="${forward}" alt="forward nav"/>
                        </div>
                        </button>
                    </li>
                    <li id="s-logout">
                        <button href="#" class="">
                            <div class="d-f jc-sb ai-c">
                                <div class="d-f ai-c g-25">
                                    <div class="sw-s">
                                        <img src="${logout}" alt="icon for Logout" class=""/>
                                    </div>
                                    <p class="p s-c">Log out</p>
                                </div>
                                <img src="${forward}" alt="forward nav"/>
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div id="notification" class="notification">Copied!</div>
    <div class="wel-overlayLoader visible">
        <div id="closeWelcomeBtn" class="close-btn">&times;</div>
        <img src="${welcomeImg}" alt="Welcome Image" class="welcome-img" load="lazy">
    </div>
    <nav>
        <div>
            <img src="${logo}" alt="Logo">
        </div>
        <div>
            <img src="${hamburger}" alt="Logo" id="menuToggle">
        </div>
    </nav>
    <div class="wrapper">
        <div class="content-con w-100 df-fc">
        <div>
            <img src="${show}" alt="slider" class="show-img">
        </div>
        <div class="pt-10">
            <div class="game-info df-fc">
            <div class="game-top d-f g-20 ta-c">
                <div class="t-s h-70 d-f jc-sa al-it w-50">
                    <div class="profile-container">
                        <div class="profile-image" id="profileImage" style="height:50px;width:50px">
                            <div class="overlay" style="font-size:12px">
                                <img src="${show}" alt="slider" class="show-img">
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="g-p p-b-3" id="g-p">Chikko</h4>
                        <span class="g-i" id="g-i"></span>
                    </div>
                </div>
                <div class="t-s h-70 d-f jc-sa al-it w-50">
                    <div>
                        <img src="${shopping}" class="w-30" alt="Profile icon">
                    </div>
                    <div>
                        <h6 class="pre pt-b p-b-3">Pre Order Limit</h6>
                        <h4><span class="g-ct" id="g-ct">50</span> / <span class="g-t" id="g-t">50</span></h4>
                    </div>
                </div>
            </div>
            <div class="game-bottom d-f g-20 ta-c">
                <div class="t-s jc-c d-f f-c h-90 t-c w-50">
                    <h6 class="pre  ta-c">Wallet Amount</h6>    
                    <div class="d-f gp-t">
                        <div>
                            <img src="${wallet}" class="w-40" alt="Profile icon">
                        </div>
                        <div>
                            <h4 id="w-a">585629</h4>
                            <h6 class="pre mt-8">USDT</h6>
                        </div>
                    </div>
                </div>
                <div class="t-s jc-c d-f f-c h-90 ta-c w-50">
                    <h6 class="pre  ta-c">Profit's Earned</h6>
                    <div class="d-f gp-t">
                        <div>
                            <img src="${dollar}" class="w-40" alt="dollar icon"/>
                        </div>
                        <div>
                            <h4 id="t-e">560</h4>
                            <h6 class="pre mt-8">USDT</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-b-10-15">
                <div class="cs-bottom d-f jc-se">
                <div class="cursor" id="con-cs">
                    <div>
                        <div class="bc">
                            <img src=${customer} class="w-40" alt = "customer care">
                        </div>
                        <h5>Contact CS</h5> 
                    </div>
                </div>
                <div class="cursor" id="cert">
                    <div>
                        <div class="bc">
                            <img src=${certificate} class="w-40" alt = "certificate">
                        </div>
                        <h5>Certificate</h5>           
                    </div>
                </div>
                <div id="withdrawal" class="cursor">
                    <div>
                        <div class="bc">
                            <img src=${withdraw} class="w-30" alt = "withdraw">
                        </div>
                        <h5>Withdraw</h5>
                    </div>
                </div>
            </div>
            </div>
           
            <div class="cs-top d-f jc-se">
                <div class="cursor" id="tcon">
                    <div class="bc">
                    <img src=${tc} class="w-20" alt="terms and condition">
                    </div>
                    <h5>T & C</h5>
                </div>
                <div class="cursor" id="event">
                    <div class="bc">
                    <img src=${event} class="w-20" alt ="terms and condition">
                    </div>
                        <h5>Event</h5>
                </div>
                <div class="cursor" id="faq">
                    <div class="bc">
                    <img src=${FAQ} class="w-25" alt = "Frequently asked questions">
                    </div>
                    <h5>FAQ</h5>
                </div>
                <div class="cursor" id="about">
                    <div class="bc">
                        <img src=${about} class="w-35" alt = "About NP Digital">
                    </div>
                    <h5>About Us</h5>
                </div>
            </div>
        </div>
        </div>
        
    </div>
    </div>
    
    <div class="nav-bottom ta-c" style="width:${finalWidth}px">
        <div class="home" id="home">
            <img src=${optimize} class="w-40" alt = "customer care">
            <h4>Home</h4> 
        </div>
        <div class="" id="startBtn">
                <img src=${home} class="w-45" alt= "starting">
            <h4>Starting</h4> 
        </div>
        <div class="" id="records">
            <img src=${records} class="w-40" alt = "customer care">
            <h4>Records</h4> 
        </div>
    </div>
    <div class="com-overlayLoader">
        <div class="c-modal-body home-p cs-home">
            <div class="cs-wrapper" id="cs-wrapper">
            
            </div>
            <button class="login-btns small-btn canBtn secondary"  id="cancelBtn">Cancel</button>
        </div>
    </div>
    `
    ;
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
   
   // welcome screen
   // Check if closeWelcomeBtn is defined


    // Add event listeners for menu toggle
    const menuToggle = element.querySelector('#menuToggle');
    const sideMenu = element.querySelector('#sideMenu');
    const closeBtn = element.querySelector('#closeBtn');

    menuToggle.addEventListener('click', () => {
        sideMenu.style.width = '400px';
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.style.width = '0';
    });

        const invitationCodeNumber = element.querySelector('#invitationCodeNumber');
        const invitationCodeSpan = element.querySelector('#invitationCodeSpan');
        const notification = element.querySelector('#notification');
        
  
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

    async function fetchUserDataUrl(storedUserId) {
        const profileImageRef = ref(storage, `profiles/${storedUserId}.jpg`);
        try {
            const url = await getDownloadURL(profileImageRef);
           console.log('this is me '. url)
            return url || undefined;
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.log('No existing profile image found.');
            } else {
                console.error('Error fetching profile image:', error);
            }
            return undefined;  // Explicitly return undefined if there is an error
        }
    }
         
    

    invitationCodeNumber.addEventListener('click', async () => {
        console.log('clicked')
        try {
            await navigator.clipboard.writeText(invitationCodeSpan.textContent);
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 500);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    });



     // Retrieve userId (username) from session storage
     const storedUserId = getItemWithFallback('userId');
   
 
     if (storedUserId) {
         
          let userData = await fetchUserData(storedUserId);
          const profileImageURL = await fetchUserDataUrl(storedUserId);
          if(profileImageURL !== undefined){
            const profileImage = element.querySelector('#profileImage');
            profileImage.style.background = `url(${profileImageURL})`
          }
         if (userData) {
             displayUserData(userData);
             
         } else {
             console.error('Failed to fetch user data.');
         }
     } else {
         console.error('User ID not found in session or local storage.');
     }
     function displayUserData(userData) {
        const credibilityValue =  userData.member_information.reputation_points;
        element.querySelector('#g-p').textContent = capitalizeFirstLetter(userData.username.slice(0, 10));
        element.querySelector('#profileN').textContent = capitalizeFirstLetter(userData.username.slice(0, 14));
        element.querySelector('#g-i').textContent = userData.member_information.invitation_code;
        element.querySelector('#invitationCodeSpan').textContent = userData.member_information.invitation_code;
        element.querySelector('#w-a').textContent = roundToTwoDecimals(userData.wallet_information.wallet_balance);
        element.querySelector('#s-wa').textContent = "USDT " + roundToTwoDecimals(userData.wallet_information.wallet_balance);
        element.querySelector('#g-ct').textContent = userData.mission_information.completed;
        element.querySelector('#g-t').textContent = userData.mission_information.total_tasks;
        element.querySelector('#t-e').textContent = userData.mission_information.profits_earned;
        element.querySelector('.thumb').style.left = `${credibilityValue}%`;
        element.querySelector('.range-ind').style.width = `${credibilityValue}%`;
    }
  

     function showLoaderAndNavigate(path) {
        showLoader();
        setTimeout(() => {
            window.history.pushState({}, '', path);
            handleRoute();
            removeLoader();
        }, 1800); // Small delay to ensure loader is visible
    }
    element.querySelector('#withdrawal').addEventListener('click', () => {
        showLoaderAndNavigate('/withdrawal');
    });
    
    element.querySelector('#cert').addEventListener('click', () => {
        showLoaderAndNavigate('/recognition');
    });
    element.querySelector('#s-wallet').addEventListener('click', () => {
        sideMenu.style.width = '0';
        showLoaderAndNavigate('/wallet');
    });

    element.querySelector('#s-transaction').addEventListener('click', () => {
        sideMenu.style.width = '0';
        showLoaderAndNavigate('/transaction');
    });
    
    element.querySelector('#faq').addEventListener('click', () => {
        showLoaderAndNavigate('/faq');
    });

    element.querySelector('#con-cs').addEventListener('click', async () => {
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


    
        element.querySelector('#s-deposit').addEventListener('click', async () => {
            sideMenu.style.width = '0';
            showLoader();
        const phoneNumbers = await fetchCustomerService();
        const csWrapper = document.querySelector('.cs-wrapper');
        csWrapper.innerHTML = '';
    
        phoneNumbers.forEach((number, index) => {
            const button = document.createElement('button');
            button.className = 'login-btns large-btn csBtn';
            button.dataset.phoneNumber = number;
            button.textContent = `Contact CS 0${index}`;
            csWrapper.appendChild(button);
    
            button.addEventListener('click', () => {
                const phoneNumber = button.dataset.phoneNumber;
                if (phoneNumber) {
                    const waUrl = `https://wa.me/${phoneNumber}`;
                    window.location.href = waUrl;
                } else {
                    alert('Unable to fetch customer service phone number.');
                }
            });
        });
    
        removeLoader();
        document.querySelector('.com-overlayLoader').classList.add('visible');

        }); 

        element.querySelector('#cancelBtn').addEventListener('click', () => {
            const overlayLoader = document.querySelector('.com-overlayLoader');
            overlayLoader.classList.remove('visible');
        });

    element.querySelector('#s-logout').addEventListener('click', () => {  
        // Clear session storage and local storage
        sessionStorage.clear();
        localStorage.clear();
        showLoaderAndNavigate('/login');
    });
    
    element.querySelector('#event').addEventListener('click', () => {
        showLoaderAndNavigate('/event');
    });
    element.querySelector('#tcon').addEventListener('click', () => {
        showLoaderAndNavigate('/t&c');
    });
    
    element.querySelector('#about').addEventListener('click', () => {
        showLoaderAndNavigate('/about');
    });
    element.querySelector('#home').addEventListener('click', () => {
        showLoaderAndNavigate('/home');
    });
    element.querySelector('#startBtn').addEventListener('click', (e) => {
        showLoaderAndNavigate('/starting');
    });
    element.querySelector('#records').addEventListener('click', (e) => {

        showLoaderAndNavigate('/records');
    });
    element.querySelector('#personal').addEventListener('click', (e) => {
        sideMenu.style.width = '0';
        showLoaderAndNavigate('/personal');
    });
    
    const welcomePopupImg = element.querySelector('.wel-overlayLoader img');
    const closeWelcomeBtn = element.querySelector('#closeWelcomeBtn');
    const overlay = element.querySelector('.wel-overlayLoader');

    // Check if closeWelcomeBtn is defined
    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener('click', () => {
            welcomePopupImg.style.display = 'none';
            overlay.style.visibility = 'hidden';
            overlay.classList.remove('visible');
        });
    } else {
        console.error('closeWelcomeBtn is not defined');
    }
    
    return element;
}

   
function roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}