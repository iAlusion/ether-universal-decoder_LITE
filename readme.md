# Introduction

This is the lite version of ether-universal-decoder. It only comes with the basic automatic decoding functions.
I specially created this for the lightweight developers that prefer their own ways.
You can simply implement these functions by requiring/importing them and call them.

Join my Discord server for more updates, upcoming packages, issues, or any thoughts or such regarding ether-universal-decoder.

    https://discord.gg/5zbS2p8Vh7

## Requirements

    - Node.js
    - Ethers V6
    - Etherscan.io API key

## Installing

npm install eud_lite

## Pros and Cons

### Pros
    
    - Lightweight
    - Usable anywhere on your code by simply require/import
    - Flexible for personal needs

### Cons

    - Not every ABI will work

        This is due to Etherscan.io and their response towards unverified 
        contract sources. There is as far as I know sadly no work around for this.
    
    - From time to time missing functions on fetched ABI

        There is a workaround for this, this is added to the full version. 
        It is an process that needs to be carefully attended. Ensuring you 
        are using the proper functions is highly important. I can only 
        guarantee that, if I preset all data in a cache.
      
    - Needs some skills to implement this on a automatic level

        For instance; implementing it on a provider that listens to any live events.
        You would best implement it by adding a place to store all known contracts in your program.

    - No workarounds that are being added to the full version

        Lightweight comes with a cost

    - Contracts that make use of a single function to execute various commands
         can have impact on the result of the automatic parsing.

        An example would be Uniswap, they use a single function on the router 
        to execute multiple commands. Although this is not an issue in general, 
        it is an issue when fetching ABIs to decode with known input to the ABI. 
        This is due to the params will be for Uniswap [bytes, bytes[], uint256]. 
        The decoder will decode the bytes which in turn still need to be decoded 
        again with matching input from the Uniswap Router. A quick fix would be 
        adding another decode function when the result is parsed on the 
        Uniswap Universal Router known addresses. 
        
        Most contracts will not have this issue.

## Usage

```js
/* esmodule  */
import eud from 'eud_lite';

/* commonJS */
const eud = require('eud_lite');

const contract = await eud.buildContract(<contractAddress>, <EtherscanApiKey>); <Promise>
```

## Issues

Please do report any issues to me on Discord in my server. 

    https://discord.gg/5zbS2p8Vh7

## Future updates

I'm working on a separate package with the full version that will keep fixing as much ABIs as it can via the workarounds. This package will become the hub of all structured data to be required by users for their needs.