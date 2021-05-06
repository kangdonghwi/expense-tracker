const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let data = {
    labels: [],
    datasets: [{
      label: 'My First Dataset',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
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
        text: text.value,
        amount: +amount.value
    }

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();
    
    updateLocalStorage();

    addChart();

    text.value = '';
    amount.value = '';
}

function addChart(){
    let chartTransactions = transactions.map(a => a);

    for(let i=0; i<chartTransactions.length;i++){
        if(chartTransactions[i].amount < 0){
            myChart.data.labels.push(chartTransactions[i].text);
            myChart.data.datasets[0].data.push(chartTransactions[i].amount);
        }
    }
    myChart.update();
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
        ${transaction.text} <span> ${sign}${Math.abs(transaction.amount)}</span>
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
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    
    addChart();
    updateValues();
}

init();
form.addEventListener('submit', add)