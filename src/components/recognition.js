import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import cert from 'images/cert.png';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';

const app = initializeApp(firebaseConfig);

function getScreenWidth() {
    return window.innerWidth || 470; // Fallback width if window.innerWidth is not available
}

export function renderRecognition(){
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.style.padding = `0px 15px 70px`;
    element.innerHTML = `
      
    <div class="faq ta-c" style="line-height:1.6; padding:0px 0px 40px">
        <h2 class="ta-c vip-heading">
            Certification
        </h2>
        <img src="${cert}" alt="npm events earnings" width="90%">
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