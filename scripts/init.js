const Web3 = require('web3');
const Contract = require('../build/contracts/MemberCertification.json');
const httpProvider = 'http://127.0.0.1:8545';
const web3 = new Web3(httpProvider);

const contractAddress = '0x10b8C1E01146505e8b06e0ecf9F1973B7E8F59d8';
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
  },
  {
    name: 'Karen Ho',
    id: 'O123789456',
    ethAddress: '0x3ed707Bb53D526c470B85cF9A19fCDB7DA5df55d'
  },
  {
    name: 'Leo Kuo',
    id: 'K123666444',
    ethAddress: '0x4922E14FeEd3e03ac7FAb84d483a78f99E13ae5d'
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
Promise.all(ACCOUNTS.map(account => {
  return addMember(account.name, account.id, account.ethAddress, true)
}))
.then(result => {
  console.log(`${result.length} members were added.`);
  return addOrganization('NCCU', ACCOUNTS[0].ethAddress);
})
.then(result => {
  console.log('NCCU was added.');
  return addOrganization('TOEFL', ACCOUNTS[2].ethAddress);
})
.then(result => {
  console.log('TOEFL was added.');
  return addOrganization('Google', ACCOUNTS[3].ethAddress);
})
.then(result => {
  console.log('Google was added.');
  console.log('Init process successfully ended.');
})

.catch(err => {
  console.error(err);
})

