const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const cors = require('cors');
const contractABI =  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "ExpenseAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "expenses",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "studentExpenses",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "addExpense",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExpensesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getExpense",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "studentId",
        "type": "string"
      }
    ],
    "name": "getStudentExpenses",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contractAddress = '0xcB90dA4C0bf857adc784Ad3EbbAE9D1c4E5A1254'; // Replace with your contract address
const account = '0xdB1C0Bb978047139866aEcDcB8b516cA67D2CaC0'; // Replace with your account address from Ganache

const app = express();
app.use(bodyParser.json());
app.use(cors());

const provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/add-expense', async (req, res) => {
    const { studentId, amount, description } = req.body;

    if (!studentId || !amount || !description) {
        return res.status(400).send('Student ID, amount, and description are required');
    }

    try {
        const gasEstimate = await contract.methods.addExpense(studentId, amount, description).estimateGas({ from: account });
        await contract.methods.addExpense(studentId, amount, description).send({
            from: account,
            gas: gasEstimate + 20000, // Adding some buffer to the gas estimate
            gasPrice: '20000000000' // 20 Gwei
        });
        res.json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Error interacting with the blockchain:', error);
        res.status(500).send(`Error interacting with the blockchain: ${error.message}`);
    }
});

app.get('/expenses', async (req, res) => {
    try {
        const expensesCount = await contract.methods.getExpensesCount().call();
        const expenses = [];

        for (let i = 0; i < expensesCount; i++) {
            const expense = await contract.methods.expenses(i).call();
            expenses.push(expense);
        }

        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Error fetching expenses');
    }
});

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000');
});
