const MemberCertification = artifacts.require("MemberCertification");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MemberCertification);
};
