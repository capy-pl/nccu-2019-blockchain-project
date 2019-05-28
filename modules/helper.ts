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
