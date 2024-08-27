document.addEventListener('DOMContentLoaded', () => {
    console.log('Edit Transaction Modal JavaScript Loaded');

    // Fetch categories from the server and populate dropdown
    const populateCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            const categorySelect = document.getElementById('edit-transaction-category');
            categorySelect.innerHTML = '';

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    populateCategories();

    // Modal element references
    const editTransactionModal = document.getElementById('edit-transaction-modal');
    const closeButton = document.querySelector('.close');
    const saveTransactionButton = document.getElementById('save-transaction-btn');

    // Close modal logic
    closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        editTransactionModal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === editTransactionModal) {
            editTransactionModal.style.display = 'none';
        }
    };

    // Function to enable save button when form changes
    const enableSaveButton = () => {
        saveTransactionButton.style.display = 'block'; // Show the save button
    };

    // Add event listeners to form fields to enable the save button on change
    const formFields = ['edit-transaction-name', 'edit-transaction-amount', 'edit-transaction-category', 'edit-transaction-type', 'edit-transaction-date'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', enableSaveButton); // Listen for input changes
    });

    // Function to open the edit transaction modal
    const openEditTransactionModal = async (transactionId) => {
        try {
            const response = await fetch(`/api/transactions/${transactionId}`);
            const transaction = await response.json();

            // Populate the form fields with the fetched transaction data
            document.getElementById('edit-transaction-name').value = transaction.name;
            document.getElementById('edit-transaction-amount').value = transaction.amount;
            document.getElementById('edit-transaction-category').value = transaction.category_id;
            document.getElementById('edit-transaction-type').value = transaction.transactionType;
            document.getElementById('edit-transaction-date').value = transaction.date;
            document.getElementById('edit-transaction-note').value = transaction.note || '';

            // Set the transaction ID in the form (used for saving changes)
            document.getElementById('edit-transaction-form').setAttribute('data-transaction-id', transactionId);

            // Initially hide the save button until something changes
            saveTransactionButton.style.display = 'none';

            // Show the modal
            editTransactionModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching transaction:', error);
        }
    };

    // Event delegation: Handle the click event on the transaction edit button using delegation
    document.querySelector('.transaction-history').addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-transaction')) {
            event.preventDefault();
            const transactionId = event.target.getAttribute('data-transaction-id');
            console.log('Opening modal for transaction ID:', transactionId);

            try {
                // Open the modal with the transaction details
                openEditTransactionModal(transactionId);
            } catch (error) {
                console.error('Error opening modal:', error);
            }
        }
    });

    // Save changes logic
    const editTransactionForm = document.getElementById('edit-transaction-form');
    editTransactionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const transactionId = editTransactionForm.getAttribute('data-transaction-id');
        const name = document.getElementById('edit-transaction-name').value.trim();
        const amount = parseFloat(document.getElementById('edit-transaction-amount').value);
        const categoryId = parseInt(document.getElementById('edit-transaction-category').value);
        const transactionType = document.getElementById('edit-transaction-type').value;
        const date = document.getElementById('edit-transaction-date').value;
        const note = document.getElementById('edit-transaction-note').value;

        try {
            const response = await fetch(`/api/transactions/update/${transactionId}`, {
                method: 'PUT',
                body: JSON.stringify({ name, amount, category_id: categoryId, transactionType, date, note }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                editTransactionModal.style.display = 'none';
                document.location.reload();
            } else {
                alert('Failed to update transaction.');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    });
});
