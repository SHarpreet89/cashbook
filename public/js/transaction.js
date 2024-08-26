const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('textarea[id="transaction-name"]').value;
  const amount = document.querySelector('number[id="transaction-amount"]').value;
  const category = document.querySelector('select[id="transaction-category"]').value;

  await fetch(`/transactions`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      amount,
      category,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  document.location.replace('/dashboard');
};

document.querySelector('#submit-transaction').addEventListener('submit', newFormHandler);
