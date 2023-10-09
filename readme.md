# Introduction

This is the lite version of ether-universal-decoder. It only comes with the basic automatic decoding functions.
I specially created this for the lightweight developers that prefer their own ways.
You can simply implement these functions by requiring/importing them and call them.

## Requirements

    - Node.js
    - Ethers.js^6.7

## Pros and Cons

### Pros
    
    - Lightweight
    - Usable anywhere on your code by simply require/import
    - Flexible for personal needs

### Cons

    - Not every ABI will work
    - From time to time missing functions on ABI due to fetching from etherscan
    - Needs some skills to implement this on a automatic level
    - No workarounds that are being added to the full version

## Usage

```js
/* esmodule  */
import eud from 'ethers-universal-decoder_lite';

/* commonJS */
const eud = require('ethers-universal-decoder_lite');

const contract = await eud.buildContract(<contractAddress>, <EtherscanApiKey>); <Promise>
```

## Future updates

I'm working on a separate package with the full version that will keep fixing as much ABIs as it can via the workarounds. This package will become the hub of all structured data to be required by users for their needs.