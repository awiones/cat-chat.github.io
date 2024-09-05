document.addEventListener("DOMContentLoaded", function() {
    const warningModal = document.getElementById("warning-modal");
    const warningSound = document.getElementById("warning-sound");

    // Function to check if the user is on Android or screen width is less than 800px
    function showWarning() {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const screenWidth = window.innerWidth;

        if (isAndroid || screenWidth < 800) {
            warningModal.style.display = "block";
            warningSound.play(); // Play warning sound
        }
    }

    // Call the function on page load
    showWarning();

    // Also check on window resize, in case user resizes the screen
    window.addEventListener("resize", function() {
        showWarning();
    });
});
