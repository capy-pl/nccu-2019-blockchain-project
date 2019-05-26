const CertificationContract = artifacts.require("Certification");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(CertificationContract);
};
