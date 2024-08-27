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
});

const newFormHandler = async (event) => {
  event.preventDefault();

<<<<<<< HEAD
  const name = document.querySelector('#transaction-name').value.trim();
  const amount = parseFloat(document.querySelector('#transaction-amount').value);
  const category_id = parseInt(document.querySelector('#transaction-category').value); // Get category_id
  const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const transactionType = document.querySelector('input[name="transaction-type"]:checked').value; // Incoming or outgoing
  const recurringTransaction = document.querySelector('#recurring-checkbox').checked; // Boolean for recurring transaction

  if (name && amount && category_id) {
    const response = await fetch(`/transactions/add`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        amount,
        date,
        category_id,
        transactionType,
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

document.querySelector('#submit-transaction').addEventListener('click', newFormHandler);
=======
  const name = document.querySelector('textarea[id="transaction-name"]').value;
  const amount = document.querySelector('number[id="transaction-amount"]').value;
  const categoryid = document.querySelector('select[id="transaction-category"]').value;
  const type = document.querySelector('textarea[id="transaction-type"]').value;

  await fetch(`/transactions/add`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      amount,
      date,
      categoryid,
      type,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  document.location.replace('/dashboard');
};
document.querySelector('#submit-transaction').addEventListener('submit', newFormHandler);
>>>>>>> main
