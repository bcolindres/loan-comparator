// Grab form and result elements

const form = document.getElementById('loan-form');

const resultsDiv = document.getElementById('results');

// Store all loan entries here

const loans = [];

form.addEventListener('submit', function (e) {

  e.preventDefault(); // Stop form from refreshing the page

  // Step 1: Grab input values

  const loanAmount = parseFloat(document.getElementById('loanAmount').value);

  const propertyValue = parseFloat(document.getElementById('propertyValue').value);

  const creditScore = parseInt(document.getElementById('creditScore').value);

  const interestRate = parseFloat(document.getElementById('interestRate').value);

  const productType = document.getElementById('productType').value;

  // Step 2: Determine loan term based on product type

  const productTerms = {

    'HELOAN_5': 5,

    'HELOAN_10': 10,

    'REFI_10': 10,

    'REFI_15': 15,

    'REFI_20': 20,

    'REFI_30': 30,

    'ARM_5_6': 30,

    'ARM_7_6': 30,

    'ARM_10_6': 30

  };

  const years = productTerms[productType] || 30;

  const months = years * 12;

  const monthlyRate = interestRate / 100 / 12;



  // Step 3: Calculate monthly payment using amortization formula

  const monthlyPayment = (

    loanAmount * monthlyRate *

    Math.pow(1 + monthlyRate, months)

  ) / (Math.pow(1 + monthlyRate, months) - 1);

  const totalPaid = monthlyPayment * months;

  const totalInterest = totalPaid - loanAmount;

  const paid5yr = getPaymentsOverYears(loanAmount, monthlyRate, monthlyPayment, 5);

  const paid10yr = getPaymentsOverYears(loanAmount, monthlyRate, monthlyPayment, 10);

  const paid15yr = getPaymentsOverYears(loanAmount, monthlyRate, monthlyPayment, 15);

  function getPaymentsOverYears (loanAmount, monthlyRate, monthlyPayment, years){
    let balance = loanAmount;
    let totalPaid = 0;

    for (let i = 0; i < years * 12; i++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        balance -= principal;
        totalPaid += monthlyPayment;

        if (balance <= 0 ) break; // stop early if loan is paid off 
    }
    return totalPaid;
  }

  // Step 4: Store and display the result

  const loanData = {

    productType,

    loanAmount,

    interestRate,

    years,

    monthlyPayment,

    totalInterest,

    totalPaid,

    paid5yr, 

    paid10yr, 

    paid15yr

  };

  loans.push(loanData);

  displayResults();

});

function displayResults() {

  let html = `
<table border="1" cellpadding="8" cellspacing="0">
<thead>
<tr>
<th>Product</th>
<th>Loan Amount</th>
<th>Interest Rate</th>
<th>Term (Years)</th>
<th>Monthly P&I</th>
<th>Total Interest</th>
<th>Total Cost</th>
<th>Paid After 5yr</th>
<th>Paid After 10yr</th>
<th>Paid After 15yr</th>
<th>Delete</th>
</tr>
</thead>
<tbody>

  `;

loans.forEach((loan, index) => {
 html += `
<tr>
<td>${loan.productType}</td>
<td>$${loan.loanAmount.toLocaleString()}</td>
<td>${loan.interestRate.toFixed(2)}%</td>
<td>${loan.years}</td>
<td>$${loan.monthlyPayment.toFixed(2)}</td>
<td>$${loan.totalInterest.toFixed(2)}</td>
<td>$${loan.totalPaid.toFixed(2)}</td>
<td>$${loan.paid5yr.toFixed(2)}</td>
<td>$${loan.paid10yr.toFixed(2)}</td>
<td>$${loan.paid15yr.toFixed(2)}</td>
<td><button class="delete-btn" data-index="${index}">🗑️</button></td>
</tr>
 `;
});



  html += `</tbody></table>`;

  resultsDiv.innerHTML = html;

}

resultsDiv.addEventListener('click', function (e) {
 if (e.target.classList.contains('delete-btn')) {
   const index = parseInt(e.target.getAttribute('data-index'));
   loans.splice(index, 1); // Remove the loan
   displayResults();       // Re-render the table
 }
});
 