import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faNode, faJs, faReact } from '@fortawesome/free-brands-svg-icons'

import { Eth, Xtz, Usdt } from 'react-cryptocoins'

export default function CryptoIcon({ crypto }) {
  switch (crypto) {
    case 'Ethereum':
      return <Eth />
    case 'Tezos':
      return <Xtz />
    case 'Stablecoin':
      return <Usdt />
    case 'Twitter':
      return <FontAwesomeIcon icon={faTwitter} />
    case 'Bots':
      return <FontAwesomeIcon icon={faRobot} />
    case 'Node.js':
      return <FontAwesomeIcon icon={faNode} />
    case 'Javascript':
      return <FontAwesomeIcon icon={faJs} />
    case 'React':
    case 'Gatsby':
      return <FontAwesomeIcon icon={faReact} />

    default:
      return null
  }
}
