let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
// ✅ You already have this:
addBtn.addEventListener("click", () => {
  addToy = !addToy;
  toyFormContainer.style.display = addToy ? "block" : "none";
});
fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(toys => {
    toys.forEach(toy => renderToyCard(toy));
  });
function renderToyCard(toy) {
  const toyDiv = document.createElement("div");
  toyDiv.className = "card";
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add like button behavior
  const likeBtn = toyDiv.querySelector("button");
  likeBtn.addEventListener("click", () => handleLike(toy, toyDiv));

  document.getElementById("toy-collection").appendChild(toyDiv);
}
const form = document.querySelector(".add-toy-form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = e.target.name.value;
  const image = e.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
    .then(res => res.json())
    .then(newToy => {
      renderToyCard(newToy); // Add to DOM
      form.reset(); // Clear the form
    });
});
function handleLike(toy, cardElement) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // update the local toy object
      cardElement.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
