import React from 'react';
import User from '../modules/user';
import { getCurrentEthAddress } from '../modules/helper';
import {
  Container,
  Loader,
  Dimmer,
  MenuItemProps,
  Segment,
} from 'semantic-ui-react';
import Page from '../components/page';
import Navbar from '../components/navbar';
import CertificationItem from '../components/certificationItem';
import OrgCertificaionItem from '../components/orgCertificationItem';
import AddCertificationModal from '../components/modal/addCertificationModal';
import IssueCertificationModal, { IssueCertificationModalState } from '../components/modal/issueCertificationModal';

import { Certification, BN } from '../modules/library';

interface HomeInterface {
  activeItem: string;
  loading: boolean;
  user: User | undefined;
}

class Home extends React.Component<{}, HomeInterface> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeItem: 'home',
      loading: true,
      user: undefined
    };
    this.onClick = this.onClick.bind(this);
    this.addCertificate = this.addCertificate.bind(this);
    this.onOrgSubmit = this.onOrgSubmit.bind(this);
    this.issueCertificate = this.issueCertificate.bind(this);
  }

  public async componentDidMount() {
    const address = getCurrentEthAddress() as string;
    const user = new User(address);
    await user.load();
    this.setState({
      loading: false,
      user,
    })
  }

  public onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) {
    const { name } = data;
    if (name)
    this.setState({
      activeItem: name,
    });
  }
  
  public async addCertificate(certification: Certification): Promise<void> {
    if (this.state.user) {
      try {
        await this.state.user.contract.addCertification(certification.title, certification.value, certification.validFrom, certification.validTo, true, certification.orgName);
        await this.state.user.load();
        this.forceUpdate();
      } catch(err) {
        console.error(err);
      }
    }
  }

  public async issueCertificate(data: IssueCertificationModalState): Promise<void> {
    if (this.state.user) {
      try {
          await this.state.user.contract.issueCertification(data.id, data.title, data.value, data.validFrom, data.validTo, true, this.state.user.orgNameIfAdmin);
          await this.state.user.load();
          this.forceUpdate();
      } catch(err) {
        console.log(err);
      }
    }
  }

  public async onOrgSubmit(mode: 'verify' | 'reject', index: BN, orgName: string): Promise<void> {
    if (this.state.user) {
      if (mode === 'verify') {
        await this.state.user.contract.verifyApplication(orgName, index.toNumber());
      } else {
        await this.state.user.contract.rejectApplication(orgName, index.toNumber());
      }
      await this.state.user.load();
      this.forceUpdate();
    }
  }

  public getCertificationItemList() {
    if (this.state.user) {
      if (this.state.activeItem == 'home') {
        return this.state.user.certificationList.map(certification => <CertificationItem
          key={certification.applicationIndex.toNumber()}
          certification={certification}
          />)
      }
      if (this.state.activeItem == 'orgApp')
        return this.state.user.orgApplicationList.map(certification => <OrgCertificaionItem
          key={certification.applicationIndex.toNumber()}
          certification={certification} 
          onOrgSubmit={this.onOrgSubmit}
          />);
    } else {
      return;
    }
  }

  render() {
    if (!this.state.user || this.state.loading) {
      return (
        <div>
          <Container>
            <Dimmer active>
              <Loader size='huge'>Loading...</Loader>
            </Dimmer>
          </Container>
        </div>
      );
    }
    const certificationList = this.getCertificationItemList();

    return (<Page>
      <Navbar
        onClick={this.onClick}
        name={this.state.user.name}
        activeItem={this.state.activeItem}
        isAdmin={this.state.user.isAdmin}
      />
      <Segment>
        {
          this.state.activeItem == 'home' ? 
            <AddCertificationModal onSubmit={this.addCertificate} />
            : <IssueCertificationModal members={this.state.user.memberList} onSubmit={this.issueCertificate} />
        }
        { certificationList }
      </Segment>
    </Page>);
  }
}

export default Home;