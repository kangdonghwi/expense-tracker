const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const date = document.querySelector('.date');
const amount = document.getElementById('amount');

let data = {
    labels: [],
    datasets: [{
      label: '지출내역',
      data: [],
      backgroundColor: [
        'rgba(73, 16, 28, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      hoverOffset: 4
    }]
};

let config = {
    type: 'pie',
    data: data,
};

let myChart = new Chart(document.getElementById('myChart'),config);

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function add(e) {
    e.preventDefault();

    const transaction = {
        id:generateID(),
        date: date.value,
        text: text.value,
        amount: +amount.value
    }

    transactions.push(transaction);

    updateLocalStorage();
    
    updateValues();

    addTransactionDOM(transaction);

    addChart();

    date.value = '';
    text.value = '';
    amount.value = '';
}

function addChart() {
    let chartTransactions = transactions.filter(a => a.amount<0);

    let chartLabels = chartTransactions.map(a=> a.text)
    let chartAmount = chartTransactions.map(a=> a.amount)

    myChart.data.labels = chartLabels;
    myChart.data.datasets[0].data = chartAmount;
    
    myChart.update();
}

function sortByDate() {
    return transactions.sort((a, b) => {
        if (a.date > b.date) {
          return 1
        } else if (a.date < b.date) {
          return -1
        } else {
          return 0
        }
    });
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
  }

function updateValues(){

    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item),0);

    const income = amounts.filter(item => item > 0).reduce((acc,item) => (acc += item),0);

    const expense = (amounts.filter(item => item < 0).reduce((acc,item) => (acc += item),0)*-1);

    money_plus.innerText = `${income}`;
    money_minus.innerText = `${expense}`;
    balance.innerText = `${total}`;
}

function addTransactionDOM(transaction){
    const sign = transaction.amount <0 ? '-' : '+';

    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
       ${transaction.date}<br/>${transaction.text} <span> ${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransacion(${transaction.id})">X</button>
    `;

    list.appendChild(item);
}

function removeTransacion(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function init(){
    sortByDate();
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    
    addChart();
    updateValues();
}

init();
form.addEventListener('submit', add)