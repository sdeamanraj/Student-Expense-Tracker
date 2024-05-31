// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentExpenseTracker {
    struct Expense {
        string studentId;
        uint256 amount;
        string description;
    }

    Expense[] public expenses;
    mapping(string => uint256[]) public studentExpenses;

    event ExpenseAdded(string studentId, uint256 amount, string description);

    function addExpense(string memory studentId, uint256 amount, string memory description) public {
        expenses.push(Expense(studentId, amount, description));
        studentExpenses[studentId].push(expenses.length - 1);
        emit ExpenseAdded(studentId, amount, description);
    }

    function getExpensesCount() public view returns (uint256) {
        return expenses.length;
    }

    function getExpense(uint256 index) public view returns (string memory studentId, uint256 amount, string memory description) {
        require(index < expenses.length, "Expense does not exist");
        Expense storage expense = expenses[index];
        return (expense.studentId, expense.amount, expense.description);
    }

    function getStudentExpenses(string memory studentId) public view returns (uint256[] memory) {
        return studentExpenses[studentId];
    }
}
