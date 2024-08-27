document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch categories from the server
    const response = await fetch('/categories');
    const categories = await response.json();

    // Populate the category dropdown
    const categorySelect = document.getElementById('transaction-category');
    categorySelect.innerHTML = ''; // Clear placeholder

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id; // Use category ID as the value
      option.textContent = category.name; // Display category name
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    const categorySelect = document.getElementById('transaction-category');
    categorySelect.innerHTML = '<option value="">Failed to load categories</option>';
  }

  // Attach the form submission event listener
  const form = document.getElementById('add-transaction');
  form.addEventListener('submit', newFormHandler);
});

const newFormHandler = async (event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  const name = document.querySelector('#transaction-name').value.trim();
  const amount = parseFloat(document.querySelector('#transaction-amount').value);
  const category_id = parseInt(document.querySelector('#transaction-category').value); // Get category_id
  const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const transactionType = document.querySelector('#transaction-type').value; // Get value from select box
  const recurringTransaction = document.querySelector('#recurring-transaction').checked; // Boolean for recurring transaction

  // Ensure all required fields are filled out
  if (name && amount && category_id && transactionType) {
    const response = await fetch(`/transactions/add`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        amount,
        date,
        category_id,
        transactionType, // Should now be 'Credit' or 'Debit'
        recurringTransaction
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to add transaction.');
    }
  } else {
    alert('Please fill out all required fields.');
  }
};
