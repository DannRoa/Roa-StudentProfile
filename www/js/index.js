
const isAndroidEmulator = window.location.href.includes("android_asset") || (window.cordova && cordova.platformId === 'android');
const API_BASE_URL = isAndroidEmulator ? "http://10.0.2.2:3000/api" : "http://localhost:3000/api";
const TOKEN_KEY = "jwt_auth_token";
const DEFAULT_IMAGE = "img/pfp.png";

const defaultProfile = {
    fullname: "Dann Ryven Carl Roa",
    course: "BS Information Technology",
    year: "3rd Year",
    about: "I am currently an Information Technology student at Xavier University – Ateneo de Cagayan. Throughout my journey as an IT student, I have engaged in building desktop GUI interfaces, integrating Python with backend SQL databases, and developing web structures.",
    skills: "Python Development, Java GUI (Swing), SQL & Database Management, Web Development, Front End, Back End",
    imageUri: DEFAULT_IMAGE
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

function initApp() {
    const token = localStorage.getItem(TOKEN_KEY);
    const isMainPage = document.getElementById('login-section') !== null;

    if (token && token !== "null" && token !== "undefined") {
        if (isMainPage) showProtectedApp();
        fetchProfileFromDB();
    } else {
        localStorage.removeItem(TOKEN_KEY);
        if (isMainPage) {
            showLoginScreen();
        } else {
            window.location.href = "index.html";
            return;
        }
    }


    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.onsubmit = handleLogin;

  
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.onclick = handleLogout;

  
    const toggleEditBtn = document.getElementById('btn-toggle-edit');
    if (toggleEditBtn) toggleEditBtn.onclick = openEditMode;

    const cancelEditBtn = document.getElementById('btn-cancel-edit');
    if (cancelEditBtn) cancelEditBtn.onclick = cancelEdit;

    const editForm = document.getElementById('edit-profile-form');
    if (editForm) editForm.onsubmit = saveProfile;

   
    const menuBtn = document.getElementById('btn-menu');
    if (menuBtn) menuBtn.onclick = toggleSidebar;

    const closeDrawerBtn = document.getElementById('btn-close-drawer');
    if (closeDrawerBtn) closeDrawerBtn.onclick = toggleSidebar;

    const overlay = document.getElementById('drawer-overlay') || document.getElementById('sidebarOverlay');
    if (overlay) overlay.onclick = toggleSidebar;


    const avatarContainer = document.getElementById('avatar-container');
    if (avatarContainer) {
        avatarContainer.onclick = openPhotoModal;
    }

    const closeModalBtn = document.getElementById('btn-close-modal');
    if (closeModalBtn) closeModalBtn.onclick = closePhotoModal;

    const takePhotoBtn = document.getElementById('btn-take-photo');
    if (takePhotoBtn) takePhotoBtn.onclick = () => captureProfilePicture('camera');

    const choosePhotoBtn = document.getElementById('btn-choose-photo');
    if (choosePhotoBtn) choosePhotoBtn.onclick = () => captureProfilePicture('gallery');

  
    const browserFileInput = document.getElementById('browser-file-input');
    if (browserFileInput) {
        browserFileInput.onchange = handleBrowserFileSelect;
    }
}

function navigateToProfile() {
    toggleSidebar();
    const isMainPage = document.getElementById('login-section') !== null;
    if (isMainPage) {
        closeEditMode();
        showProtectedApp();
        fetchProfileFromDB();
    } else {
        window.location.href = "index.html";
    }
}


function showLoginScreen() {
    const loginSection = document.getElementById('login-section');
    const appWrapper = document.getElementById('app-wrapper');

    if (loginSection) {
        loginSection.style.display = 'block';
        loginSection.classList.remove('hidden');
    }
    if (appWrapper) {
        appWrapper.style.display = 'none';
        appWrapper.classList.add('hidden');
    }
}

function showProtectedApp() {
    const loginSection = document.getElementById('login-section');
    const appWrapper = document.getElementById('app-wrapper');

    if (loginSection) {
        loginSection.style.display = 'none';
        loginSection.classList.add('hidden');
    }
    if (appWrapper) {
        appWrapper.style.display = 'block';
        appWrapper.classList.remove('hidden');
    }
}

function handleLogin(event) {
    if (event) event.preventDefault();

    const studentIdInput = document.getElementById('login-id');
    const passwordInput = document.getElementById('login-password');

    const studentIdOrEmail = studentIdInput ? studentIdInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!studentIdOrEmail || !password) {
        showLoginError("Please provide both Student ID/Email and Password.");
        return;
    }

    fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIdOrEmail, password })
    })
    .then(response => {
        if (!response.ok) throw new Error("Invalid student ID or password.");
        return response.json();
    })
    .then(data => {
        localStorage.setItem(TOKEN_KEY, data.token);
        showProtectedApp();
        fetchProfileFromDB();
    })
    .catch(err => {
        showLoginError(err.message || "Unable to connect to authentication server.");
    });
}

function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "index.html";
}

function showLoginError(msg) {
    const alertBanner = document.getElementById('alert-message');
    if (alertBanner) {
        alertBanner.innerText = msg;
        alertBanner.classList.remove('hidden');
        setTimeout(() => alertBanner.classList.add('hidden'), 4000);
    } else {
        alert(msg);
    }
}

function fetchProfileFromDB() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        if (document.getElementById('login-section')) {
            showLoginScreen();
        } else {
            window.location.href = "index.html";
        }
        return;
    }

    fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem(TOKEN_KEY);
            if (document.getElementById('login-section')) {
                showLoginScreen();
            } else {
                window.location.href = "index.html";
            }
            throw new Error("Session expired or invalid profile request.");
        }
        return response.json();
    })
    .then(student => {
        const profile = {
            fullname: student.name || student.full_name || defaultProfile.fullname,
            course: student.course || defaultProfile.course,
            year: student.year_level || student.year || defaultProfile.year,
            about: student.bio || student.about || defaultProfile.about,
            skills: student.skills || defaultProfile.skills,
            imageUri: (student.profile_picture && student.profile_picture.length > 20)
                        ? student.profile_picture
                        : DEFAULT_IMAGE
        };

        renderProfileUI(profile);
    })
    .catch(err => {
        console.error("Database fetch error:", err);
        renderProfileUI(defaultProfile);
    });
}

function renderProfileUI(profile) {
    const displayName = document.getElementById('display-name');
    const displayCourse = document.getElementById('display-course');
    const displayYear = document.getElementById('display-year');
    const profileImg = document.getElementById('profile-image');

    if (displayName) displayName.innerText = profile.fullname;
    if (displayCourse) displayCourse.innerText = profile.course;
    if (displayYear) displayYear.innerText = profile.year;
    if (profileImg) {
        profileImg.src = profile.imageUri;
        profileImg.onerror = () => { profileImg.src = DEFAULT_IMAGE; };
    }

    const fieldName = document.getElementById('field-name');
    const fieldCourse = document.getElementById('field-course');
    const fieldYear = document.getElementById('field-year');
    const fieldBio = document.getElementById('field-bio');
    const fieldSkills = document.getElementById('field-skills');

    if (fieldName) fieldName.innerText = profile.fullname;
    if (fieldCourse) fieldCourse.innerText = profile.course;
    if (fieldYear) fieldYear.innerText = profile.year;
    if (fieldBio) fieldBio.innerText = profile.about;
    if (fieldSkills) fieldSkills.innerText = profile.skills;

    const aboutElem = document.getElementById('about-page-description');
    if (aboutElem) aboutElem.innerText = profile.about;

    const cardsContainer = document.getElementById('dynamic-skills-cards');
    if (cardsContainer) renderSkillCards(profile.skills, cardsContainer);

    const contactElem = document.getElementById('contact-page-name');
    if (contactElem) contactElem.innerText = profile.fullname;
}

function saveProfile(event) {
    if (event) event.preventDefault();

    const fullname = document.getElementById('edit-name').value.trim();
    const course = document.getElementById('edit-course').value.trim();
    const year = document.getElementById('edit-year').value.trim();
    const about = document.getElementById('edit-bio').value.trim();
    const skills = document.getElementById('edit-skills').value.trim();

    if (!fullname || !course || !year) {
        alert("Please complete required profile fields.");
        return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const updatedPayload = {
        name: fullname,
        course: course,
        year_level: year,
        bio: about,
        skills: skills
    };

    fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPayload)
    })
    .then(response => {
        if (!response.ok) throw new Error("Unable to update profile record.");
        return response.json();
    })
    .then(data => {
        fetchProfileFromDB();
        closeEditMode();
    })
    .catch(err => {
        alert(err.message || "Failed to persist changes to database.");
    });
}

function captureProfilePicture(mode) {
    closePhotoModal();

    if (navigator.camera && typeof Camera !== 'undefined') {
        const sourceType = (mode === 'gallery')
            ? Camera.PictureSourceType.PHOTOLIBRARY
            : Camera.PictureSourceType.CAMERA;

        const cameraOptions = {
            quality: 60,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth: 400,
            targetHeight: 400
        };

        navigator.camera.getPicture(onCameraSuccess, onCameraError, cameraOptions);
    } else {
        const browserFileInput = document.getElementById('browser-file-input');
        if (browserFileInput) {
            browserFileInput.click();
        } else {
            alert("Camera plugin is not available in browser mode.");
        }
    }
}

function handleBrowserFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64Img = evt.target.result;
        saveImageToDatabase(base64Img);
    };
    reader.readAsDataURL(file);
}

function onCameraSuccess(imageData) {
    const base64Img = imageData.startsWith("data:image") ? imageData : ("data:image/jpeg;base64," + imageData);
    saveImageToDatabase(base64Img);
}

function saveImageToDatabase(base64Img) {
    const token = localStorage.getItem(TOKEN_KEY);

    const imgElement = document.getElementById('profile-image');
    if (imgElement) imgElement.src = base64Img;

    fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile_picture: base64Img })
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to save image to database");
        return res.json();
    })
    .then(() => {
        fetchProfileFromDB();
    })
    .catch(err => console.error("Error saving image to DB:", err));
}

function onCameraError(message) {
    if (message && (message.toLowerCase().includes("cancel") || message.toLowerCase().includes("no image selected"))) {
        return;
    }
    alert("Camera error: " + message);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-drawer') || document.querySelector('.sidebar');
    const overlay = document.getElementById('drawer-overlay') || document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('hidden');
    if (overlay) overlay.classList.toggle('hidden');
}

function openPhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function openEditMode() {
    const nameField = document.getElementById('field-name');
    const courseField = document.getElementById('field-course');
    const yearField = document.getElementById('field-year');
    const bioField = document.getElementById('field-bio');
    const skillsField = document.getElementById('field-skills');

    if (nameField) document.getElementById('edit-name').value = nameField.innerText !== '-' ? nameField.innerText : '';
    if (courseField) document.getElementById('edit-course').value = courseField.innerText !== '-' ? courseField.innerText : '';
    if (yearField) document.getElementById('edit-year').value = yearField.innerText !== '-' ? yearField.innerText : '';
    if (bioField) document.getElementById('edit-bio').value = bioField.innerText !== '-' ? bioField.innerText : '';
    if (skillsField) document.getElementById('edit-skills').value = skillsField.innerText !== '-' ? skillsField.innerText : '';

    document.getElementById('view-profile-card').classList.add('hidden');
    document.getElementById('edit-profile-card').classList.remove('hidden');
}

function cancelEdit() {
    closeEditMode();
}

function closeEditMode() {
    document.getElementById('edit-profile-card').classList.add('hidden');
    document.getElementById('view-profile-card').classList.remove('hidden');
}

function renderSkillCards(skillsString, container) {
    container.innerHTML = ""; 

    if (!skillsString || skillsString.trim() === "") {
        container.innerHTML = "<p class='body-text'>No skills added yet.</p>";
        return;
    }

    const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (skillsArray.length === 0) {
        container.innerHTML = "<p class='body-text'>No skills added yet.</p>";
        return;
    }

    skillsArray.forEach(skill => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'skill-card';
        cardDiv.innerHTML = `
            <h4>${skill}</h4>
            <p class="body-text">Proficiency and active application in ${skill}.</p>
        `;
        container.appendChild(cardDiv);
    });
}