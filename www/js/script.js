
const defaultProfile = {
    fullname: "Dann Ryven Carl Roa",
    course: "BS Information Technology",
    year: "3rd Year",
    about: "I am currently an Information Technology student at Xavier University – Ateneo de Cagayan. Throughout my journey as an IT student, I have engaged in building desktop GUI interfaces, integrating Python with backend SQL databases, and developing web structures. I am currently learning and practicing the fundamentals of Networking!",
    skills: "Python Development, Java GUI (Swing), SQL & Database Management, Web Development, Front End, Back End"
};

const STORAGE_KEY = "student_profile_data";


document.addEventListener("DOMContentLoaded", () => {
    loadProfileData();
});


function loadProfileData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let profile = defaultProfile;

    if (savedData) {
        try {
            profile = JSON.parse(savedData);
        } catch (e) {
            console.error("Error loading profile data:", e);
        }
    }


    if (document.getElementById('display-fullname')) {
        document.getElementById('display-header-name').innerText = profile.fullname;
        document.getElementById('display-header-course').innerText = `${profile.course} - ${profile.year}`;
        document.getElementById('display-fullname').innerText = profile.fullname;
        document.getElementById('display-course').innerText = profile.course;
        document.getElementById('display-year').innerText = profile.year;
        document.getElementById('display-about').innerText = profile.about;
        document.getElementById('display-skills').innerText = profile.skills;
    }


    const aboutElem = document.getElementById('about-page-description');
    if (aboutElem) {
        aboutElem.innerText = profile.about;
    }

 
    const skillsElem = document.getElementById('skills-page-list');
    if (skillsElem) {
        skillsElem.innerText = profile.skills;
    }

    const cardsContainer = document.getElementById('dynamic-skills-cards');
    if (cardsContainer) {
        renderSkillCards(profile.skills, cardsContainer);
    }


    const contactElem = document.getElementById('contact-page-name');
    if (contactElem) {
        contactElem.innerText = profile.fullname;
    }
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


function openEditMode() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const profile = savedData ? JSON.parse(savedData) : defaultProfile;

    document.getElementById('input-fullname').value = profile.fullname;
    document.getElementById('input-course').value = profile.course;
    document.getElementById('input-year').value = profile.year;
    document.getElementById('input-about').value = profile.about;
    document.getElementById('input-skills').value = profile.skills;

    const errorAlert = document.getElementById('error-alert');
    errorAlert.style.display = "none";
    errorAlert.innerText = "";

    document.getElementById('profile-view-mode').style.display = "none";
    document.getElementById('profile-edit-mode').style.display = "block";
}


function saveProfile(event) {
    event.preventDefault();

    const fullname = document.getElementById('input-fullname').value.trim();
    const course = document.getElementById('input-course').value.trim();
    const year = document.getElementById('input-year').value.trim();
    const about = document.getElementById('input-about').value.trim();
    const skills = document.getElementById('input-skills').value.trim();

    if (!fullname || !course || !year || !about || !skills) {
        showError("Please complete all required fields.");
        return;
    }

    const updatedProfile = {
        fullname: fullname,
        course: course,
        year: year,
        about: about,
        skills: skills
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    
    loadProfileData();
    closeEditMode();
}

function cancelEdit() {
    closeEditMode();
}

function closeEditMode() {
    document.getElementById('profile-edit-mode').style.display = "none";
    document.getElementById('profile-view-mode').style.display = "block";
}

function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    errorAlert.innerText = message;
    errorAlert.style.display = "block";
}