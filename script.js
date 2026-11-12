
// ========================================
// 1. DATA
// ========================================
let translations = JSON.parse(localStorage.getItem('translations')) || [];
let translationToEdit = null;


// ========================================
// 2. DOM ELEMENTS
// ========================================
const translationList = document.getElementById('translationList');
const translationForm = document.getElementById('translationForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const duplicateWarning = document.getElementById('duplicateWarning');

const collectionCount = document.getElementById('collectionCount');

const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

let translationToDelete = null;

// ========================================
// DELETE MODAL EVENTS
// ========================================

// Cancel deletion
cancelDelete.addEventListener('click', function() {
    deleteModal.style.display = 'none';
    translationToDelete = null;
});

// Confirm deletion
confirmDelete.addEventListener('click', function() {
    if (!translationToDelete) {
        return;
    }

    translations = translations.filter(function(item) {
        return item !== translationToDelete;
    });

    localStorage.setItem('translations', JSON.stringify(translations));

    updateCategoryOptions();
    displayTranslations(searchInput.value, categoryFilter.value);

    deleteModal.style.display = 'none';
    translationToDelete = null;
});


// ========================================
// 3. DISPLAY TRANSLATIONS
// ========================================
function displayTranslations(searchText, selectedCategory) {
    // Clear the previous displayed entries
    translationList.innerHTML = '';

    // Update the collection count / number automatically
    collectionCount.textContent = String(translations.length).padStart(2, '0');

    // Search and filter translations
    const filteredTranslations = translations.filter(function(translation) {
        const matchesSearch = translation.english.toLowerCase().includes((searchText || '').toLowerCase());
        const matchesCategory = !selectedCategory || translation.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Display each filtered translation
    filteredTranslations.forEach(function(translation) {
        const entry = document.createElement('div');
        entry.classList.add('translation-entry');

        const translationInfo = document.createElement('div');
        const translationActions = document.createElement('div');

        translationInfo.classList.add('translation-info');
        translationActions.classList.add('translation-actions');

        translationInfo.innerHTML = `
            <div class="translation-language">
                <span class="language-label">English</span>
                <span class="language-text">${translation.english}</span>
            </div>
            <div class="translation-language">
                <span class="language-label">Spanish</span>
                <span class="language-text">${translation.spanish}</span>
            </div>
            <div class="translation-language">
                <span class="language-label">Indonesian</span>
                <span class="language-text">${translation.indonesian}</span>
            </div>
            <div class="translation-category">${translation.category}</div>
        `;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', function() {
            document.getElementById('english').value = translation.english;
            document.getElementById('spanish').value = translation.spanish;
            document.getElementById('indonesian').value = translation.indonesian;
            document.getElementById('category').value = translation.category;

            translationToEdit = translation;
        });

        translationActions.appendChild(editButton);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', function() {
            translationToDelete = translation;
            deleteModal.style.display = 'flex';
        });

        translationActions.appendChild(deleteButton);

        // Put both containers inside the entry
        entry.appendChild(translationInfo);
        entry.appendChild(translationActions);

        // Add the completed entry to the translation list
        translationList.appendChild(entry);
    });
}


// ========================================
// 4. CATEGORY OPTIONS
// ========================================
function updateCategoryOptions() {
    // Reset the category filter options
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    // Get all categories
    const categories = translations.map(function(translation) {
        return translation.category;
    });

    const uniqueCategories = [...new Set(categories)];

    // Create an option for each unique category
    uniqueCategories.forEach(function(category) {
        const option = document.createElement('option');

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


// ========================================
// 5. SEARCH AND FILTER EVENTS
// ========================================

// Category filter event
categoryFilter.addEventListener('change', function() {
    const selectedCategory = categoryFilter.value;

    displayTranslations(searchInput.value, selectedCategory);
});

// Search event
searchInput.addEventListener('input', function() {
    const searchText = searchInput.value;

    displayTranslations(searchText, categoryFilter.value);
});


// ========================================
// 6. FORM SUBMISSION
// ========================================
translationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    console.log("Form submitted!");

    // Get values from the form
    const english = document.getElementById('english').value;
    const spanish = document.getElementById('spanish').value;
    const indonesian = document.getElementById('indonesian').value;
    const category = document.getElementById('category').value;

    // Hide the previous warning
    duplicateWarning.style.display = 'none';

    // Check for duplicate English phrases
    const isDuplicate = translations.some(function(translation) {
        return translation !== translationToEdit &&
            translation.english.toLowerCase() === english.toLowerCase();
    });

    if (isDuplicate) {
        duplicateWarning.style.display = 'block';
        return;
    }

    console.log(english, spanish, indonesian, category);

    // Group the values into an object
    const newTranslation = {
        english: english,
        spanish: spanish,
        indonesian: indonesian,
        category: category
    };

    // Update an existing translation or add a new one
    if (translationToEdit) {
        // Update the existing translation entry
        translationToEdit.english = english;
        translationToEdit.spanish = spanish;
        translationToEdit.indonesian = indonesian;
        translationToEdit.category = category;
    } else {
        // Add the new translation entry to the translations array
        translations.push(newTranslation);
    }

    // Save translations to local storage
    localStorage.setItem('translations', JSON.stringify(translations));

    // Update the webpage
    updateCategoryOptions();
    displayTranslations(searchInput.value, categoryFilter.value);

    // Reset the form and editing variable
    translationForm.reset();
    translationToEdit = null;
});


// ========================================
// 7. INITIAL DISPLAY
// ========================================
updateCategoryOptions();
displayTranslations(searchInput.value, categoryFilter.value);