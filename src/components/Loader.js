import React from 'react'
import './loader.css'
// import Spinner from 'react-bootstrap/Spinner';
import { Spinner } from '@chakra-ui/react';

function Loader() {
  return (
    <div className="loaderContainer">
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#666666'
        size='xl'
        />
    </div>
  )
}

export default Loader
