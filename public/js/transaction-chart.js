

document.addEventListener('DOMContentLoaded', async () => {
    const transactions = await fetch('/api/transactions').then(res => res.json());
    console.log('Transactions fetched:', transactions);

    initializeExpenseChart(transactions);

    document.getElementById('submit-transaction').addEventListener('click', saveTransaction);
});

function initializeExpenseChart(transactions) {
    const categories = transactions
        .map(transaction => transaction.category.name)
        .filter((value, index, self) => self.indexOf(value) === index);

    console.log('Categories fetched:', categories);

    const ctx = document.getElementById('expense-chart').getContext('2d');

    window.expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories, // Categories
            datasets: [{
                label: transactions.map(transaction => transaction.category.name), // Category IDs
                data: transactions.map(transaction => transaction.amount), // Expense amounts
                backgroundColor: transactions.map(transaction => transaction.transactionType === 'Credit' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
                borderColor: transactions.map(transaction => transaction.transactionType === 'Credit' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })
};

function saveTransaction() {
    const category = document.getElementById('transaction-category').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const date = document.getElementById('transaction-date').value;
    const notes = document.getElementById('transaction-notes').value;

    if (category && !isNaN(amount) && date) {
        const transaction = {
            category: category,
            amount: amount,
            date: date,
            notes: notes
        };

        transactions.push(transaction);

        console.log('Transaction saved:', transaction);

        updateExpenseChart(category, amount);

        displayTransactions();

        document.getElementById('add-more-form').reset();
        document.getElementById('transaction-details-form').reset();
        document.getElementById('transaction-notes-form').reset();
    } else {
        alert('Please fill in all required fields.');
    }
}

function updateExpenseChart(category, amount) {
    const index = expenseChart.data.labels.indexOf(category);

    let backgroundColor = 'rgba(255, 99, 132, 0.2)'; // Red for Debit
    let borderColor = 'rgba(255, 99, 132, 1)'; 

    if (category.toLowerCase() === 'salary') {
        backgroundColor = 'rgba(75, 192, 192, 0.2)'; // Green for Credit
        borderColor = 'rgba(75, 192, 192, 1)'; 
    }

    if (index !== -1) {

        expenseChart.data.datasets[0].data[index] += amount;
    } else {

        expenseChart.data.labels.push(category);
        expenseChart.data.datasets[0].data.push(amount);
        expenseChart.data.datasets[0].backgroundColor.push(backgroundColor);
        expenseChart.data.datasets[0].borderColor.push(borderColor);
    }

    expenseChart.update();
}

function displayTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = ''; 

    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <p><strong>Category:</strong> ${transaction.category}</p>
            <p><strong>Amount:</strong> $${transaction.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Notes:</strong> ${transaction.notes}</p>
        `;
        transactionList.appendChild(transactionItem);
    });
}
