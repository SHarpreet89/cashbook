document.addEventListener('DOMContentLoaded', function() {
    initializeExpenseChart();

    document.getElementById('save-transaction').addEventListener('click', saveTransaction);
});

function initializeExpenseChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    window.expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Categories
            datasets: [{
                label: 'Expenses',
                data: [], // Expense amounts
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function saveTransaction() {
    const category = document.getElementById('transaction-category').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const date = document.getElementById('transaction-date').value;
    const notes = document.getElementById('transaction-notes').value;

    if (category && !isNaN(amount) && date) {
        console.log('Transaction saved:', { category, amount, date, notes });

        updateExpenseChart(category, amount);

        document.getElementById('add-more-form').reset();
        document.getElementById('transaction-details-form').reset();
        document.getElementById('transaction-notes-form').reset();
    } else {
        alert('Please fill in all required fields.');
    }
}

function updateExpenseChart(category, amount) {
    expenseChart.data.labels.push(category);
    expenseChart.data.datasets[0].data.push(amount);
    expenseChart.update();
}
