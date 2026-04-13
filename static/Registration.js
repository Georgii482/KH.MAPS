
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.start-button');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            
        window.location.href = "/AL";
            
        });
    }
});