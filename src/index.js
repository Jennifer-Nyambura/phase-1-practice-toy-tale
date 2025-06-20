let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const form = document.querySelector(".add-toy-form");

  // Toggle form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach((toy) => renderToyCard(toy));
    });

  // Handle form submission to add toy
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((res) => res.json())
      .then((newToy) => {
        renderToyCard(newToy);
        form.reset(); // Clear the form
      });
  });

  // Function to render a toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar"/>
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Like button handler
    const likeBtn = card.querySelector("button");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((res) => res.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    });

    toyCollection.appendChild(card);
  }
});
