import {transactAckDeath} from './aaUtils/transactAckDeath.js'
import React from 'react'

const testTransactAckDeath = () => {
  return <button onClick={() => { transactAckDeath('0x19CB25D9010597837078933b5546571dED91aE1f'); }}>testTransactAckDeath</button>;
}

export default testTransactAckDeath