// migrations/2_deploy_contracts.js
const StudentExpenseTracker = artifacts.require("StudentExpenseTracker");

module.exports = function(deployer) {
  deployer.deploy(StudentExpenseTracker);
};
