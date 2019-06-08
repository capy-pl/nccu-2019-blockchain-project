export interface Account {
  name: string;
  ethAddress: string;
}

const ACCOUNTS: Account[] = [
  {
    name: 'Luke Chen',
    ethAddress: '0x20305d11E6C5290f629654D54E71F53142D06f15'
  },
  {
    name: 'Philip Lin',
    ethAddress: '0x486289044624a9c1A202cB84Ed1FCfA56aD1E610'
  },
  {
    name: 'Karen Ho',
    ethAddress: '0x3ed707Bb53D526c470B85cF9A19fCDB7DA5df55d'
  },
  {
    name: 'Leo Kuo',
    ethAddress: '0x4922E14FeEd3e03ac7FAb84d483a78f99E13ae5d'
  }
];

export const ORGANIZATIONS = [
  {
    key: 'NCCU',
    value: 'NCCU',
    text: 'NCCU'
  },
  {
    key: 'TOEFL',
    value: 'TOEFL',
    text: 'TOEFL'
  }
];

export function storeFakeAccounts(): void {
  const accounts = JSON.stringify(ACCOUNTS);
  localStorage.setItem('accounts', accounts);
}

export function getAccounts(): Account[] | undefined {
  const accountsString = localStorage.getItem('accounts');
  if (accountsString) {
    const accounts = JSON.parse(accountsString);
    return accounts;
  }
}

const GLOBAL: any = {};

export function setCurrentEthAddress(ethAddress: string) {
  GLOBAL.ethAddress = ethAddress;
}

export function getCurrentEthAddress(): string | undefined {
  return GLOBAL.ethAddress;
}

export function clearCurrentEthAddress(): void {
  delete GLOBAL.ethAddress;
}