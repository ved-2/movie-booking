// Seat selection functionality
document.querySelectorAll('.seat').forEach(seat => {
    seat.addEventListener('click', function() {
        if (!this.classList.contains('booked')) {
            this.classList.toggle('selected');
            updateSelectedSeats();
        }
    });
});

function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsInput = document.getElementById('selectedSeats');
    const totalAmount = document.getElementById('totalAmount');
    
    const seats = Array.from(selectedSeats).map(seat => ({
        row: seat.dataset.row,
        number: seat.dataset.number,
        type: seat.dataset.type
    }));
    
    selectedSeatsInput.value = JSON.stringify(seats);
    
    // Calculate total amount based on seat type and quantity
    if (totalAmount) {
        let amount = 0;
        seats.forEach(seat => {
            amount += prices[seat.type] || 0;
        });
        totalAmount.textContent = amount.toFixed(2);
    }
}

// Bootstrap form validation
(function () {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})(); 