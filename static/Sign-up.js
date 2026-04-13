let spacerschoice = "";
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        passwordToggle.textContent = 'Show';
    }
}

const testBtn = document.getElementById('test-btn');
const overlay = document.getElementById('overlay');
const popupContainer = document.getElementById('popup-container');
const closeBtn = document.getElementById('close-btn');

testBtn.addEventListener('click', function() {
    overlay.style.display = 'block';
    popupContainer.style.display = 'block';
});

function hidePopup() {
    overlay.style.display = 'none';
    popupContainer.style.display = 'none';
}

closeBtn.addEventListener('click', hidePopup);
overlay.addEventListener('click', hidePopup);

document.getElementById('option1-btn').addEventListener('click', function() {
    alert('Human-made selected');
    hidePopup();
    spacerschoice = "Human-made";
});

document.getElementById('option2-btn').addEventListener('click', function() {
    alert('Natural-tourist selected');
    hidePopup();
    spacerschoice = "Natural-tourist";
});

document.getElementById('option3-btn').addEventListener('click', function() {
    alert('Cultural-tourist selected');
    hidePopup();
    spacerschoice = "Cultural-tourist";
});

document.getElementById('option4-btn').addEventListener('click', function() {
    alert('Novelty selected');
    hidePopup();
    spacerschoice = "Novelty";
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('email').value, 
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        choice: spacerschoice
    };
    
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.status === 201) {
            alert('Welcome to the family!');
            let users = JSON.parse(localStorage.getItem("users")) || [];
            users.push(userData);
            localStorage.setItem("users", JSON.stringify(users));
            window.location.href = "/";
        } else {
            return response.text().then(text => {
                throw new Error(text || 'Registration failed. Please try again.');
            });
        }
    })
    .catch(error => {
        alert(error.message);
        console.error('Error:', error);
    });
});

document.getElementById('login-btn').addEventListener('click', function() {
    window.location.href = "/AL";
});