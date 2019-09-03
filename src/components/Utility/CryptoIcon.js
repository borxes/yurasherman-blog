import React from 'react'

import { Eth, Xtz } from 'react-cryptocoins'

export default function CryptoIcon({ crypto }) {
  console.log(crypto)
  switch (crypto) {
    case 'Ethereum':
      return <Eth />
    case 'Tezos':
      return <Xtz />
    default:
      return null
  }
}
