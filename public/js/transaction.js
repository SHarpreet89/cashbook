const newFormHandler = async (event) => {
  event.preventDefault();

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
