const SERVICE_ID = "service_1f270h6";
const TEMPLATE_ID = "template_062t3mg";  
const PUBLIC_KEY = "-kth1wu-pnzWvBhZP";

const prices = {
    Leo: 150,
    Jailer: 180,
    Vikram: 200
};

let bookings = [];


const form = document.getElementById("bookingForm");
const movieInput = document.getElementById("movie");
const timeInput = document.getElementById("showtime");
const quantityInput = document.getElementById("quantity");
const emailInput = document.getElementById("email");
const total = document.getElementById("total");
const message = document.getElementById("message");
const bookingList = document.getElementById("bookingList");
const bookingCount = document.getElementById("bookingCount");
const searchInput = document.getElementById("search");
const bookButton = document.getElementById("bookButton");


const emailReady = true;

emailjs.init({
    publicKey: PUBLIC_KEY
});


function calculatePrice() {
    const movie = movieInput.value;
    const quantity = Number(quantityInput.value);

    if (
        movie !== "" &&
        Number.isInteger(quantity) &&
        quantity > 0
    ) {
        total.textContent = prices[movie] * quantity;
    } else {
        total.textContent = 0;
    }
}

movieInput.addEventListener("change", calculatePrice);
quantityInput.addEventListener("input", calculatePrice);

// Reset the displayed price and message
form.addEventListener("reset", function () {
    setTimeout(function () {
        total.textContent = 0;
        message.textContent = "";
    }, 0);
});

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const movie = movieInput.value;
    const showtime = timeInput.value;
    const quantity = Number(quantityInput.value);
    const email = emailInput.value.trim();

    if (!prices[movie] || !showtime) {
        message.textContent = "Please select a movie and showtime.";
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        message.textContent =
            "Ticket quantity must be a positive whole number.";
        return;
    }

    if (!emailInput.checkValidity() || email === "") {
        message.textContent = "Please enter a valid email address.";
        return;
    }

    const price = prices[movie] * quantity;

    if (!emailReady) {
        message.textContent =
            "Email service is not configured. Please set up EmailJS first.";
        return;
    }

    bookButton.disabled = true;
    bookButton.textContent = "Sending confirmation...";

    try {
        ion email
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            to_email: email,
            movie: movie,
            showtime: showtime,
            quantity: quantity,
            total_price: price
        });

        const booking = {
            id: Date.now() + Math.random(),
            movie: movie,
            showtime: showtime,
            quantity: quantity,
            email: email,
            price: price
        };

        bookings.push(booking);

        displayBookings();
        form.reset();

        message.textContent =
            "Booking successful! Confirmation email sent.";

    } catch (error) {
        console.error("Email error:", error);

        message.textContent =
            "Email could not be sent. No booking was saved. Please try again.";
    } finally {
        bookButton.disabled = false;
        bookButton.textContent = "Book Tickets";
    }
});

function displayBookings() {

    bookingList.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredBookings = bookings.filter(function (booking) {
        return (
            booking.movie.toLowerCase().includes(searchText) ||
            booking.email.toLowerCase().includes(searchText)
        );
    });

    bookingCount.textContent = bookings.length;

    if (filteredBookings.length === 0) {
        bookingList.textContent = "No bookings found.";
        return;
    }

    filteredBookings.forEach(function (booking) {

        const card = document.createElement("div");

        const details = document.createElement("p");

        details.textContent =
            "Movie: " + booking.movie +
            " | Showtime: " + booking.showtime +
            " | Tickets: " + booking.quantity +
            " | Email: " + booking.email +
            " | Total: ₹" + booking.price;

        const cancelButton = document.createElement("button");

        cancelButton.textContent = "Cancel Booking";

        cancelButton.addEventListener("click", function () {

            const confirmCancel = confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (confirmCancel) {
                bookings = bookings.filter(function (item) {
                    return item.id !== booking.id;
                });

                displayBookings();

                message.textContent = "Booking cancelled successfully.";
            }
        });

        card.appendChild(details);
        card.appendChild(cancelButton);

        bookingList.appendChild(card);
    });
}

searchInput.addEventListener("input", displayBookings);

displayBookings();