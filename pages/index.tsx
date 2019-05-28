import React from 'react';
import MemberCertificationContract from '../modules/library';
import { Account, storeFakeAccounts, getAccounts } from '../modules/helper';
import { Segment, Loader, Container, Header, Icon } from 'semantic-ui-react';
import Page from '../components/page';

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
  }

  public componentDidMount() {
    const customWindow = window as any;
    customWindow['MemberCertificationContract'] = MemberCertificationContract;
    storeFakeAccounts();
    const accounts = getAccounts();
    if (accounts)
    this.setState({
      loading: false,
      accounts,
    });
  }

  public getAccountList() {
    return this.state.accounts.map(account => <Segment color='teal'>
      <h3>{ account.ethAddress }</h3>
      <p>{ account.name }</p>
      <Icon name='chevron right' />
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
