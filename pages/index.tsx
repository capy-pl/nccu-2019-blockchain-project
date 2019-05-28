import React from 'react';
import User from '../modules/user';
import { Account, storeFakeAccounts, getAccounts, setCurrentEthAddress } from '../modules/helper';
import { Segment, Loader, Container, Header, Icon } from 'semantic-ui-react';
import Page from '../components/page';
import Router from 'next/router';

interface IndexState {
  accounts: Account[];
  loading: boolean;
}
const style = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
  zIndex: 50,
};

class Index extends React.Component<{}, IndexState> {
  constructor(props: any) {
    super(props);
    this.state = {
      accounts: [],
      loading: true,
    };
    this.onClick = this.onClick.bind(this);
  }

  public componentDidMount() {
    const customWindow = window as any;
    customWindow['User'] = User;
    storeFakeAccounts();
    const accounts = getAccounts();
    if (accounts)
    this.setState({
      loading: false,
      accounts,
    });
  }

  public onClick(ethAddress: string) {
    setCurrentEthAddress(ethAddress);
    Router.push('/home');
  }

  public getAccountList() {
    return this.state.accounts.map(account => <Segment 
    className='login-segment'
    color='teal'
    onClick={ () => { this.onClick(account.ethAddress); }}
    >
      <h3>{ account.ethAddress }</h3>
      <p>{ account.name }</p>
    </Segment>)
  }

  public render() {
    if (this.state.loading) {
      return <Loader />
    }
    return (
      <Page>
        <div style={style}>
          <Container>
            <Header as='h2' textAlign='center'>
              Login
              <Header.Subheader>
                Select An Account. 
              </Header.Subheader>
            </Header>
            <Segment.Group>
              {this.getAccountList()}
            </Segment.Group>
          </Container>
        </div>
      </Page>
    )
  }
}
export default Index
