import { handleRoute } from '../index';
import firebaseConfig from '../firebaseConfig';
import { initializeApp } from 'firebase/app';
import records from 'images/records.svg';
import optimize from 'images/optimize.svg';
import home from 'images/home.svg';
import { showLoader, removeLoader } from './loader';
import { getFirestore, doc, getDoc, query, where, collection, getDocs, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes,listAll, updateMetadata, getDownloadURL, getMetadata, deleteObject} from 'firebase/storage';
import forward from 'images/forward.svg';
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Utility functions
function getScreenWidth() {
    return window.innerWidth || 430; // Fallback width if window.innerWidth is not available
}

// Real-time listener for user data




function getItemWithFallback(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error('Session storage not available. Using local storage as fallback.');
        return localStorage.getItem(key);
    }
}

function checkInputHasValue(inputElement) {
    return inputElement.value.trim() !== '';
}





// Render Withdrawal function
export async function renderPersonal() {
    // Retrieve userId (username) from session storage
    const storedUserId = getItemWithFallback('userId');
    const element = document.createElement('div');
    
        const screenWidth = getScreenWidth();
        const finalWidth = screenWidth > 430 ? '430' : screenWidth;

        element.className = 'container pt-50';
        element.style.width = `${finalWidth}px`;
        element.innerHTML = `
            <div id="errorContainer" class="error-message"></div>
            <div class="t-s pa-10">
                <div class="d-f jc-sb ai-c pa-10">
                    <p class="p s-c bold">Profile Image</p>
                    <div class="profile-container">
                        <div class="profile-image" id="profileImage">
                            <div class="overlay" style="font-size:12px">Change</div>
                        </div>
                        <input type="file" id="fileInput" accept="image/*" style="display: none;">
                    </div>
                </div>
                <hr>
                <div class="d-f jc-sb pa-20">
                    <p class="p s-c bold pa-10">Username</p>
                    <p class="p s-c bold pa-10" style="color: #ce8269">${storedUserId}</p>
                </div>
            </div>
            <br><br>
            <ul class="t-s pad-0">
                <li class="" id="s-deposit" style="padding:15px 0">
                    <button href="#" class="pa-10 d-f jc-sb ai-c" id="changePassword">
                        <p class="p s-c bold">Change Password</p>
                        <img src="${forward}" alt="forward nav"/>
                    </button>
                </li>
                <hr>
                <li class="" id="s-deposit" style="padding:15px 0">
                    <button href="#" class="pa-10 d-f jc-sb ai-c" id="securityPin">
                        <p class="p s-c bold">Change Security Pin</p>
                        <img src="${forward}" alt="forward nav"/>
                    </button>
                </li>
            </ul>
        `;
        const profileImage = element.querySelector('#profileImage');
        
        const profileImageRef = ref(storage, `profiles/${storedUserId}.jpg`);
        getDownloadURL(profileImageRef)
        .then((url) => {
            profileImage.style.backgroundImage = `url(${url})`;
        })
        .catch((error) => {
            if (error.code === 'storage/object-not-found') {
            console.log('No existing profile image found.');
            } else {
            console.error('Error fetching profile image:', error);
            }
        });

        
        element.querySelector('#profileImage').addEventListener('click', function() {
            
            const fileInputElement = element.querySelector('#fileInput');
            document.getElementById('fileInput').click();
            fileInputElement.addEventListener('change', async function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImage.style.backgroundImage = `url(${e.target.result})`;
                        console.log(e.target.result)
                        const newImageRef = ref(storage, `profiles/${storedUserId}.jpg`);
                        uploadBytes(newImageRef , file).then((snapshot) => {
                            console.log('Uploaded a blob or file!');
                          });
                    };
                    reader.readAsDataURL(file);}
                    
            });
            
        });
        // Event listeners
        const errorContainer = element.querySelector('#errorContainer');
        const securityButton = element.querySelector("#securityPin");
        const passwordButton = element.querySelector("#changePassword");

        // when the security Button is clicked
        securityButton.addEventListener('click', () => {
            showLoaderAndNavigate('/security');
        })
        passwordButton.addEventListener('click', () => {
            showLoaderAndNavigate('/moresecurity');
        });
        // Navigation
        const navBottom = document.createElement('div');
        navBottom.className = 'nav-bottom';
        navBottom.style.width = `${finalWidth}px`;
        navBottom.innerHTML = `
            <div id="home">
                <img src=${optimize} alt="customer care">
                <h4>Home</h4>
            </div>
            <div id="startBtn">
                <img src=${home} alt="starting">
                <h4>Starting</h4>
            </div>
            <div id="records">
                <img src=${records} alt="customer care">
                <h4>Records</h4>
            </div>
        `;

        navBottom.querySelector('#home').addEventListener('click', () => {
            showLoaderAndNavigate('/home');
        });
        navBottom.querySelector('#startBtn').addEventListener('click', () => {
            showLoaderAndNavigate('/starting');
        });
        navBottom.querySelector('#records').addEventListener('click', () => {
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
    }, 500); // Simulate some loading time
}


    
 