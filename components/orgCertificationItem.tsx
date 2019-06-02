import React from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react'
import { CertificationResponse } from '../modules/library';
import VerifyCertificationModal from '../components/modal/veritfyCertificationModal';
import { BN } from '../modules/library';

interface CertificationItemProps {
  certification: CertificationResponse;
  onOrgSubmit: (mode: 'verify' | 'reject', index: BN, orgName: string) => Promise<void>;
}

const CertificationItem = ({ certification, onOrgSubmit }: CertificationItemProps) => {
  return (
    <Segment style={{ padding: 0 }}>
      <Grid stretched celled='internally'>
        <Grid.Row stretched={true}>
          <Grid.Column stretched={true} width={12}>
            <h3>
              {certification.name}
            </h3>
            <h3>
              {certification.title}
            </h3>
            <p>
              {certification.value}
            </p>
          </Grid.Column>
          <Grid.Column width={2} textAlign='center'>
            <VerifyCertificationModal mode='verify' onConfirm={onOrgSubmit} certification={certification} />
          </Grid.Column>
          <Grid.Column width={2} textAlign='center'>
            <VerifyCertificationModal mode='reject' onConfirm={onOrgSubmit} certification={certification} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}


export default CertificationItem;
