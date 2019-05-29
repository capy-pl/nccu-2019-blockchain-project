import React from 'react';
import { Icon, Item } from 'semantic-ui-react'

const CheckIcon = () => (
  <Item>
    <Icon size='large' color='green' name='check' /> Verified
  </Item>
)

const RejectIcon = () => (
  <Item>
    <Icon size='large' color='red' name='x' /> Rejected
  </Item>
)

const PendingIcon = () => (
  <Item>
    <Icon size='large' loading name='spinner' /> Pending
  </Item>
)

export {
  CheckIcon,
  RejectIcon,
  PendingIcon
};
