// Set the date we're counting down to (YYYY, MM-1, DD, HH, MM, SS)
// Note: Months are 0-based in JavaScript (0 = January, 11 = December)
const eventDate = new Date(2025, 4, 28, 17, 0, 0); // December 31, 2024 at 6:00 PM

// Update the countdown every 1 second
const countdown = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the event date
    const distance = eventDate - now;
    
    // If the countdown is finished
    if (distance < 0) {
        clearInterval(countdown);
        document.querySelector('.countdown-subtitle').textContent = "Thank you for joining us – the event has concluded.";
        document.querySelector('.countdown-timer').style.display = 'none';
        return;
    }
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the result
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}, 1000);
