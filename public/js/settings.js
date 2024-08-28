document.addEventListener('DOMContentLoaded', () => {
  const categoryForm = document.getElementById('category-form');
  const newCategoryInput = document.getElementById('new-category');

  categoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const categoryName = newCategoryInput.value.trim();

    if (!categoryName) {
      alert('Please enter a category name.');
      return;
    }

    try {
      const response = await fetch('/api/categories/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        // Refresh the page to show the new category
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category. Please try again.');
    }
  });
});