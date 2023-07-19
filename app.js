// API Endpoint for searching meals
const SEARCH_API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// API Endpoint for fetching a meal by ID
const MEAL_API = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

// Variables to store state
let searchResults = [];
let favoriteMeals = [];

// Function to fetch meals from the API based on search query
async function fetchMeals(searchQuery) {
  const response = await fetch(SEARCH_API + searchQuery);
  const data = await response.json();
  searchResults = data.meals || [];
  displaySearchResults();
}

// Function to display search results
function displaySearchResults() {
  const searchResultsElement = document.getElementById('searchResults');
  searchResultsElement.innerHTML = '';

  searchResults.forEach((meal) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${meal.strMealThumb}" alt="Meal Image">
      <span>${meal.strMeal}</span>
      <button class="btn btn-primary btn-sm" onclick="viewMealDetails('${meal.idMeal}')">View Details</button>
      <button class="btn btn-outline-primary btn-sm" onclick="addToFavorites('${meal.idMeal}')">Add to Favorites</button>
    `;
    searchResultsElement.appendChild(li);
  });
}

// Function to fetch meal details by ID
async function fetchMealDetails(mealId) {
  const response = await fetch(MEAL_API + mealId);
  const data = await response.json();
  return data.meals[0];
}

// Function to display meal details
function displayMealDetails(meal) {
  const mealDetailPage = document.getElementById('mealDetailPage');
  const mealDetailName = document.getElementById('mealDetailName');
  const mealDetailImage = document.getElementById('mealDetailImage');
  const mealDetailInstructions = document.getElementById('mealDetailInstructions');
  const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');

  mealDetailName.textContent = meal.strMeal;
  mealDetailImage.src = meal.strMealThumb;
  mealDetailInstructions.textContent = meal.strInstructions;
  addToFavoritesBtn.setAttribute('onclick', `addToFavorites('${meal.idMeal}')`);

  mealDetailPage.style.display = 'block';
}

// Function to add a meal to favorites
function addToFavorites(mealId) {
  const meal = searchResults.find((meal) => meal.idMeal === mealId);
  if (meal && !favoriteMeals.includes(meal)) {
    favoriteMeals.push(meal);
    displayFavoriteMeals();
  }
}

// Function to display favorite meals
function displayFavoriteMeals() {
  const favoriteMealsList = document.getElementById('favoriteMealsList');
  favoriteMealsList.innerHTML = '';

  favoriteMeals.forEach((meal) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${meal.strMealThumb}" alt="Meal Image">
      <span>${meal.strMeal}</span>
      <button class="btn btn-danger btn-sm" onclick="removeFromFavorites('${meal.idMeal}')">Remove from Favorites</button>
    `;
    favoriteMealsList.appendChild(li);
  });

  // Save favorite meals to local storage
  localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));

  // Switch to the My Favorite Meals page
  showPage('myFavoriteMealsPage');
}

// Function to remove a meal from favorites
function removeFromFavorites(mealId) {
  const mealIndex = favoriteMeals.findIndex((meal) => meal.idMeal === mealId);
  if (mealIndex !== -1) {
    favoriteMeals.splice(mealIndex, 1);
    displayFavoriteMeals();
  }
}

// Function to load favorite meals from local storage
function loadFavoriteMeals() {
  const favoriteMealsData = localStorage.getItem('favoriteMeals');
  if (favoriteMealsData) {
    favoriteMeals = JSON.parse(favoriteMealsData);
    displayFavoriteMeals();
  }
}

// Function to switch between pages
function showPage(pageId) {
  const pages = ['homePage', 'mealDetailPage', 'myFavoriteMealsPage'];
  pages.forEach((page) => {
    const element = document.getElementById(page);
    element.style.display = page === pageId ? 'block' : 'none';
  });
}

// Function to view meal details
async function viewMealDetails(mealId) {
  const meal = await fetchMealDetails(mealId);
  displayMealDetails(meal);
  showPage('mealDetailPage');
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', (event) => {
  const searchQuery = event.target.value.trim();
  if (searchQuery !== '') {
    fetchMeals(searchQuery);
  } else {
    searchResults = [];
    displaySearchResults();
  }
});

// Load favorite meals from local storage
loadFavoriteMeals();

// Switch to the home page initially
showPage('homePage');
