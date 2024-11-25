import { handleRoute } from '../index';
import background from 'images/background.png';
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

export function renderAbout(){
    const element = document.createElement('div');
    element.className = 'container';
    element.style.width = `${finalWidth}px`;
    element.innerHTML = `
      
    <div class="about" style="line-height:1.6; padding:50px 0px">
        <h2 style="color:fefeef; margin-bottom:20px; color:#ff5e29">About Us</h2>
        <div>
            <p class="pre">
                Built on values, fueled by data and driven by creativity. We are independently owned by marketers, built for marketers, putting client results first.
            </p>
            <br>
            <p class="pre">
                We’re client partners first, committed to paving the way for growth. We’re focused on helping brands disrupt their industry through digital marketing. We’re also big on a work life balance. We’ve built a team of fun, driven, and motivated specialists who are encouraged to live our company values.
            </p>
            <br>
            <p class="pre">
                For our clients, we orchestrate the right mix of talent to build the perfect team. We put a strong focus on chemistry, relevant experience and proximity. For our employees, it doesn’t matter where you live, we have employees all over the world.
            </p>
            <br>
            <p class="pre">
                Our people differentiate us as an agency. Beyond the job titles are individuals with unique perspectives and passions that help shape the vision and values of NP Digital.
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