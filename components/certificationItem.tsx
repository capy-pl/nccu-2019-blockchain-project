import React from 'react';
import {
  Grid,
  Segment,
  List 
} from 'semantic-ui-react'
import {
  CheckIcon,
  RejectIcon,
  PendingIcon
} from './icons';
import { CertificationResponse } from '../modules/library';

interface CertificationItemProps {
  certification: CertificationResponse;
}

const CertificationItem = ({ certification }: CertificationItemProps) => {
  let icon = <PendingIcon />;
  if (certification.isCertified.toNumber() == 1) {
    icon = <CheckIcon />
  }
  if (certification.isCertified.toNumber() == -1) {
    icon = <RejectIcon />
  }
  return (
    <Segment style={{ padding: 0 }}>
      <Grid stretched celled='internally'>
        <Grid.Row stretched={true}>
          <Grid.Column verticalAlign='middle' width={3} textAlign='center'>
            { icon }
          </Grid.Column>
          <Grid.Column stretched={true} width={13}>
            <h3>
              {certification.title}
            </h3>
            <p>
              {certification.value}
            </p>
            <List>
              <List.Item icon='building' content={certification.orgName} />
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}


export default CertificationItem;
