var state = {
  balance: 0,
  income: 0,
  expense: 0,
  transactions: []
}

const balanceEl = document.querySelector('#balance');
const incomeEl = document.querySelector('#income');
const expenseEl = document.querySelector('#expense');
const transactionsEl = document.querySelector('#transaction')
const incomeBtn = document.querySelector('#incomeBtn')
const expenseBtn = document.querySelector('#expenseBtn')
const nameInputEl = document.querySelector('#name')
const amountInputEl = document.querySelector('#amount')


function init() {
  var localState = JSON.parse(localStorage.getItem('expenseTrackerState'));
  if (localState !== null) {
    state = localState
  }
  updateState();
  initListners();

}

function uniqueId() {
  return Math.round(Math.random() * 10000000)
}

function initListners() {
  incomeBtn.addEventListener('click', onAddIncomeClick);
  expenseBtn.addEventListener('click', onAddExpenseClick);
}

function onAddIncomeClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, 'income')

}
function onAddExpenseClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, 'expense')
}

function addTransaction(name, amount, type) {
  if (name !== '' && amount !== '') {
    var transaction = {
      id: uniqueId(),
      name: name,
      amount: parseInt(amount),
      type: type,
    }
    state.transactions.push(transaction)

    updateState();
  } else {
    alert('add some value')
  }
  nameInputEl.value = '';
  amountInputEl.value = '';
}

function onDeleteClick(event) {
  var id = event.target.getAttribute('data-id')
  var deleteIndex;

  for (var i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id === parseInt(id)) {
      deleteIndex = i;
      break;
    }
  }
  state.transactions.splice(deleteIndex, 1);
  updateState();
}

function updateState() {
  var balance = 0,
    income = 0,
    expense = 0,
    item;
  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    if (item.type === 'income') {
      income += item.amount;
    } else if (item.type === 'expense') {
      expense += item.amount;
    }
  }
  balance = income - expense;
  state.balance = balance;
  state.income = income;
  state.expense = expense;

  localStorage.setItem('expenseTrackerState', JSON.stringify(state))
  render();

}

function render() {
  balanceEl.innerHTML = `$${state.balance}`;
  incomeEl.innerHTML = `$${state.income}`;
  expenseEl.innerHTML = `$${state.expense}`;

  var transactionEl, containerEl, amountEl, btnEl, item;
  transactionsEl.innerHTML = ''

  for (var i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i]
    transactionEl = document.createElement('li');
    transactionEl.append(item.name);
    transactionsEl.appendChild(transactionEl);
    containerEl = document.createElement('div');
    amountEl = document.createElement('span');

    if (item.type === 'income') {
      amountEl.classList.add('income-amt')
    } else if (item.type === 'expense') {
      amountEl.classList.add('expense-amt')
    }

    amountEl.innerHTML = `$${item.amount}`;
    transactionEl.appendChild(containerEl)
    btnEl = document.createElement('button');
    btnEl.setAttribute('data-id', item.id)
    btnEl.innerHTML = 'x';
    btnEl.classList.add('removeBtn')
    btnEl.addEventListener('click', onDeleteClick);
    containerEl.appendChild(amountEl)
    containerEl.appendChild(btnEl)

  }
}
init();