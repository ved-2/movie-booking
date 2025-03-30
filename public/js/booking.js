document.addEventListener('DOMContentLoaded', function() {
    const seats = document.querySelectorAll('.seat.available');
    const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const selectedSeatsInput = document.getElementById('selectedSeatsInput');
    const totalAmountInput = document.getElementById('totalAmountInput');
    const bookButton = document.getElementById('bookButton');
    const bookingForm = document.getElementById('bookingForm');
    const selectedSeats = new Set();

    // Initially disable the book button
    bookButton.disabled = true;

    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            const seatId = this.dataset.row + this.dataset.number;

            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedSeats.delete(seatId);
            } else {
                this.classList.add('selected');
                selectedSeats.add(seatId);
            }

            updateBookingSummary();
        });
    });

    function updateBookingSummary() {
        const selectedSeatsArray = Array.from(selectedSeats);
        const totalAmount = Array.from(document.querySelectorAll('.seat.selected'))
            .reduce((sum, seat) => sum + parseInt(seat.dataset.price), 0);

        selectedSeatsDisplay.textContent = selectedSeatsArray.length ? selectedSeatsArray.join(', ') : 'None';
        totalAmountDisplay.textContent = totalAmount;
        
        selectedSeatsInput.value = JSON.stringify(selectedSeatsArray);
        totalAmountInput.value = totalAmount;

        bookButton.disabled = selectedSeatsArray.length === 0;
    }

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedSeats.size === 0) {
            alert('Please select at least one seat');
            return false;
        }

        const formData = {
            showId: document.querySelector('input[name="showId"]').value,
            selectedSeats: selectedSeatsInput.value,
            totalAmount: totalAmountInput.value
        };

        console.log('Form Data:', formData);

        if (!formData.showId || !formData.selectedSeats || !formData.totalAmount) {
            alert('Please ensure all booking information is complete');
            console.log('Missing Data:', {
                showId: !!formData.showId,
                selectedSeats: !!formData.selectedSeats,
                totalAmount: !!formData.totalAmount
            });
            return false;
        }

        this.submit();
    });
}); 