## Zero Trust Authentication Project

| Privacy-Preserving Authentication via SSI and ZKP (Using Semaphore V4). |
| ----------------------------------------------------------------------- |

## Installation

1- Clone this repository :

```bash
git clone https://github.com/SabrinaIsmahene/ZeroTrustAuthentication.git
```

2- Install the dependencies :

```bash
cd ZeroTrustAuthentication
yarn install
```

## Configuration

Before starting the server or client, you can configure environment variables by editing the .env file located in each package (authclient & authserver).
This allows you to change settings such as the server port, API keys, or other configurable parameters.

## Running the Project

1- Start a local Hardhat node :

```bash
cd packages/contracts
yarn start
```

2- Compile and deploy the smart contract :
Open another terminal and run

```bash
cd packages/contracts
yarn compile   # Compile the smart contract first
yarn deploy --network localhost   # Then deploy it to the local Hardhat node
```

3- Start the server :
Open another terminal and run

```bash
cd packages/authserver
yarn start
```

4- Start the client :
Open another terminal and run

```bash
cd packages/authclient
yarn start
```

## Notes

- Make sure all terminals remain open while running the project.
- The Hardhat node must be running before deploying the contracts.
- Adjust the .env file if you need custom ports or other configuration.
- After stopping the local Hardhat node, delete all subfolders inside the /storage directory in each package (authclient & authserver) except the /storage/abi folder before restarting, to avoid inconsistencies.
