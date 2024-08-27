document.addEventListener('DOMContentLoaded', () => {
    const addTransactionBtn = document.getElementById('add-transaction-btn');

    // Add click event listener to the button
    addTransactionBtn.addEventListener('click', () => {
        // Redirect to the transactions page
        window.location.href = '/transactions';
    });
});
