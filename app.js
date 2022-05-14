import { fetchMovieAvailability, fetchMovieList } from "./api.js";

window.onload = () => {
  var url = new URL(window.location.href);
  var movie_name = url.searchParams.get("movie-name");
  var email = url.searchParams.get("email");
  var tel = url.searchParams.get("tel");
  var seats = url.searchParams.get("seats");
  if (movie_name) {
    fetchMovieAvailability(movie_name)
      .then((seats) => {
        // console.log(seats);
        const v_none = document.getElementsByClassName("v-none");

        for (let i = 0; i < v_none.length; i++) {
          v_none[i].style.visibility = "visible";
        }

        const button = document.getElementById("book-ticket-btn");
        button.onclick = purchase;

        const booker_grid_holder =
          document.getElementById("booker-grid-holder");

        const booking_grid1 = document.createElement("div");
        booking_grid1.classList.add("booking-grid");

        for (let i = 1; i <= 12; i++) {
          const cell = document.createElement("div");
          cell.classList.add(`booking-grid-${i}`);
          if (seats.includes(i)) {
            cell.classList.add("unavailable-seat");
          } else {
            cell.classList.add("available-seat");
            cell.onclick = () => {
              cell.classList.toggle("selected-seat");
              selectedCount();
            };
          }
          cell.innerText = i;
          booking_grid1.append(cell);
        }

        const booking_grid2 = document.createElement("div");
        booking_grid2.classList.add("booking-grid");

        for (let i = 13; i <= 24; i++) {
          const cell = document.createElement("div");
          cell.classList.add(`booking-grid-${i}`);
          if (seats.includes(i)) {
            cell.classList.add("unavailable-seat");
          } else {
            cell.classList.add("available-seat");
            cell.onclick = () => {
              cell.classList.toggle("selected-seat");
              selectedCount();
            };
          }
          cell.innerText = i;
          booking_grid2.append(cell);
        }

        booker_grid_holder.append(booking_grid1, booking_grid2);
      })
      .catch((err) => console.log(err));
  }
  if (email && tel && seats) {
    const confirm_purchase = document.getElementById("booker");
    confirm_purchase.id = "Success";
    confirm_purchase.innerHTML = `
      <b>Booking details</b><br>
      Seats: ${seats}<br>
      Phone number: ${tel}<br>
      Email: ${email}
    `;
  }
};

function selectedCount() {
  const button = document.getElementById("book-ticket-btn");
  if (document.getElementsByClassName("selected-seat").length > 0) {
    button.classList.remove("d-none");
  } else {
    button.classList.add("d-none");
  }
}

let seats = [];

function purchase() {
  const selectedSeats = document.getElementsByClassName("selected-seat");
  seats = [];
  for (const seat of selectedSeats) {
    seats.push(seat.innerText);
  }

  const booker = document.getElementById("booker");
  booker.innerHTML = "";
  booker.id = "confirm-purchase";

  booker.innerHTML = `
  <h3>Confirm your booking for seat numbers:${seats.join(",")}</h3>
  <form id="customer-detail-form">
  Email <input type='email' name='email' id='email' required/><br><br>
  Phone number <input type='tel' name='tel' id='tel' required/><br><br>
  <input type="hidden" name="seats" value="${seats}" />
  <input type='submit' value='Purchase'/>
  </form>
  `;

  booker.append(h3);
}

fetchMovieList()
  .then((movies) => {
    // console.log(res);
    const movie_holder = document.getElementById("movie-holder");
    movies.forEach((movie) => {
      const movie_element = document.createElement("a");
      movie_element.classList.add("movie-link");
      movie_element.href = `index.html?movie-name=${movie.name}`;
      movie_element.innerHTML = `
          <div class="movie" data-d="moviename">
            <div class="movie-img-wrapper" style="background-image: url(${movie.imgUrl});">
            </div>
            <h4>${movie.name}</h4>
          </div>
        `;
      movie_holder.append(movie_element);
    });

    document.getElementById("loader").style.display = "none";
  })
  .catch((error) => {
    console.log(error);
  });
