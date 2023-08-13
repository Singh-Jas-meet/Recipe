/*  IMPORTANT

1. The search box at the very top cannot be empty. If there are multiple ingredients, then add all
   the ingredients to a new input box by using the + button, but keep the final ingredient in the top
   search box.

2. Once the recipe cards are loaded, click on them to view recipe. On the recipe page if you click on
   go Back button it will take you to previous page(which was loaded after search). But this time
   card on click will not work, because according to MDN Docs eventListeners can't be cloned.

*/
const addInputBoxButton = document.getElementById('addIngredientBtn');
const searchButton = document.getElementById('searchButton');
const inputBoxContainer = document.querySelector('.ingredients-input-box-container');

// function to create additional search boxes when the + button is pressed
function createInputBox() {

    const ingredient = document.getElementById('recipeIngredient').value; // Getting the value from the searchBox

    if (ingredient == "") {
        alert('Please type in a value');
    } else {
        const newInput = document.createElement('input');
        newInput.setAttribute("type", "text");
        newInput.setAttribute("class", "form-control rounded-pill w-25 list-group-item mx-1 mb-1 ingredient");
        newInput.value = ingredient;
        inputBoxContainer.appendChild(newInput);
        inputBoxContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        if (ingredient !== null) {
            document.getElementById('recipeIngredient').value = ""; // Clearing the searchBox value
        }
    }
}

// function that gets the data from the api and creates the card
function getRecipeByIngredients() {
    clearBodyForNextSearch();

    const ingredient = document.getElementById('recipeIngredient');
    const baseUrl = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";
    const apiKey = "&apiKey=17d517f6b9ce48bab5ea45ec385da3aa";
    let url = "";

    const inputBoxesAsElements = Array.from(document.querySelectorAll('.ingredient'));
    let ingredientsArray = [];
    if (inputBoxesAsElements.length == 1) {
        url = baseUrl + inputBoxesAsElements[0].value + apiKey;
    } else {

        inputBoxesAsElements.forEach(inputBox => ingredientsArray.push(inputBox.value));
        ingredientsArray = ingredientsArray.join(',+');

        url = baseUrl + ingredientsArray + apiKey;
    }

    fetch(url)
        .then(r => r.json())
        .then(data => {
            if (data.length == 0) {
                alert('Seems like this dish is new');
            }
            const recipesFoundForIngredient = [];
            data.forEach(recipe => {
                recipesFoundForIngredient.push({
                    "title": recipe.title,
                    "id": recipe.id,
                    "image": recipe.image
                });
            });
            createDishCard(recipesFoundForIngredient);
        })
}



// function to create cards for an individual dish. It takes a list of recipies and creates a card for it's every item
function createDishCard(recipeList) {
    const cardContainerInPage = document.querySelector('.dish-card-list');


    recipeList.forEach(recipe => {
        // Create the main card element
        const card = document.createElement('div');
        card.classList.add('card', 'mx-2', 'my-2', 'shadow', 'dish-card');
        card.style.cursor = 'pointer';
        card.style.width = '22%';
        card.setAttribute("data-toggle", "tooltip");
        card.setAttribute("title", "Click for recipe!");

        // Create card image
        const cardImage = document.createElement('img');
        cardImage.classList.add('card-img-top');
        cardImage.src = recipe.image
        cardImage.alt = recipe.title;

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create card title
        const cardTitle = document.createElement('h4');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = recipe.title;

        // Append elements to form the card structure
        cardBody.appendChild(cardTitle);
        card.appendChild(cardImage);
        card.appendChild(cardBody);
        cardContainerInPage.appendChild(card);
        card.addEventListener('click', () => {
            handleCardClick(recipe.id);
        });
    })
    if (cardContainerInPage.innerText !== "") {
        cardContainerInPage.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

}

// function to handle click event on a card
function handleCardClick(recipeId) {
    const baseUrl = "https://api.spoonacular.com/recipes/";
    const apiKey = "&apiKey=17d517f6b9ce48bab5ea45ec385da3aa";
    const apiUrl = baseUrl + recipeId + '/information?includeNutrition=false' + apiKey;

    let originalContent = document.documentElement.cloneNode(true);


    fetch(apiUrl)
        .then(r => r.json())
        .then(data => {

            // Create a new HTML page
            const newPage = document.createElement('html');
            const newHead = document.createElement('head');
            const newBody = document.createElement('body');

            // Add content to the new page
            const pageTitle = document.createElement('title');
            pageTitle.textContent = 'Recipe';

            const pageHeading = document.createElement('h1');
            pageHeading.textContent = data.title;

            const goBackButton = document.createElement('button');
            goBackButton.textContent = 'Go Back';
            goBackButton.addEventListener('click', () => {
                document.documentElement.replaceWith(originalContent);
                originalContent = null;
            });

            newHead.appendChild(pageTitle);
            newBody.appendChild(pageHeading); // Add heading 
            newBody.innerHTML = data.instructions; // Add instructions 
            newBody.appendChild(goBackButton);

            newPage.appendChild(newHead);
            newPage.appendChild(newBody);

            // Replace the current page with the new page
            document.documentElement.replaceWith(newPage);
        });
}



// function that clears the body of the page
function clearBodyForNextSearch() {
    document.querySelector('.dish-card-list').innerHTML = "";
}


addInputBoxButton.addEventListener('click', createInputBox);
searchButton.addEventListener('click', getRecipeByIngredients);