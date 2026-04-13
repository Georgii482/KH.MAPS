function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = 'Show';
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const formData = new FormData();
    formData.append("email", email);
    
    fetch("/YP", {
      method: "POST",
      body: formData
    })
    console.log('Login attempt:', { email, password });
    
    const loginData = {
        name: email, 
        password: password
    };
    
    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            if (response.status === 400) {
                throw new Error('Account not found. Please check your email or register a new account.');
            } else {
                throw new Error('Login failed. Please try again later.');
            }
        }
    })
    .then(data => {
        if (data === 'Success') {
            alert('Login successful!');
            window.location.href = `/YP?email=${encodeURIComponent(email)}`;
        } else if (data === 'Not Allowed') {
            alert('Incorrect password. Please try again.');
        } else {
            alert('Login failed. Please try again.');
        }
    })
    .catch(error => {
        alert(error.message);
        console.error('Error:', error);
    });
});

document.getElementById('signup-btn').addEventListener("click", function() {
    window.location.href = "/CH";
});