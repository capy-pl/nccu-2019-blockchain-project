const Web3 = require('web3');
const Contract = require('../build/contracts/MemberCertification.json');
const httpProvider = 'http://127.0.0.1:8545';
const web3 = new Web3(httpProvider);

const contractAddress = '0x3f69d9BA868Fe63CFBb7D1Cfa554F808e7A49fAE';
const ownerAddress = '0x20305d11E6C5290f629654D54E71F53142D06f15';

const ACCOUNTS = [{
    name: 'Luke Chen',
    id: 'K123789456',
    ethAddress: '0x20305d11E6C5290f629654D54E71F53142D06f15'
  },
  {
    name: 'Philip Lin',
    id: 'T123789456',
    ethAddress: '0x486289044624a9c1A202cB84Ed1FCfA56aD1E610'
  }
];

const MemberCertification = new web3.eth.Contract(Contract.abi, contractAddress);

function addMember(name, id, ethAddress, bool) {
  return new Promise((resolve, reject) => {
    MemberCertification.methods.addMember(name, id, ethAddress, bool)
    .send({
      from: ownerAddress,
      gas: 85000000
    }, function(err, result) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function addOrganization(name, defaultAdmin) {
  return new Promise((resolve, reject) => {
    MemberCertification.methods.addOrg(name, defaultAdmin).send({
      from: ownerAddress,
        gas: 85000000,
        gasPrice: 1
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}

function addCertification(title, value, validFrom, validUntil, isPublic, orgName) {
  return new Promise((resolve, reject) => {
    MemberCertification.methods.addCertification(title, value, validFrom, validUntil, isPublic, orgName).send({
      from: ownerAddress,
      gas: 85000000,
      gasPrice: 1
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
}
// Add person
const addMembers = Promise.all(ACCOUNTS.map(account => {
  return MemberCertification.methods.addMember(account.name, account.id, account.ethAddress, true)
    .send({
      from: ownerAddress,
      gas: 85000000,
      gasPrice: 1
    });
}));

const addOrganization = MemberCertification.methods.addOrg('NCCU', ACCOUNTS[0].ethAddress);

addMembers
  .then(results => {
    console.log(`${results.length} members were added.`);
    return addOrganization.send({
      from: ownerAddress,
      gas: 85000000
    });
  })
  .then(result => {
    console.log('1 Organization was added.');
    return MemberCertification.methods.addCertification('Accounting Department', 'Graduated', Date.now(), Date.now(), true, 'NCCU')
    .send({
      from: ACCOUNTS[1].ethAddress,
      gas: 85000000
    });
  })
  .then(result => {
    console.log('Certification1 added.');
    return MemberCertification.methods.addCertification('MIS Department', 'Graduated', Date.now(), Date.now(), true, 'NCCU')
    .send({
      from: ACCOUNTS[1].ethAddress,
      gas: 85000000
    });
  })
  .then(() => {
    console.log('Certification2 added.');
  })
  .catch(err => {
    console.error(err);
  })
