## Pile Tech Challenge

## How to spin it up (locally)

From project root folder

1. Install deps and spin up FE
```
yarn && yarn dev

```
in another tab also spin up BE

```
node server/server.ts
```


### Frontend

- HomePage
  - Link to transfer Form
  - Link to Address Book
  - Total Balance
- /transfer - handle the TransferForm
  - checkbox that allows to decide if the transaction is for _only-known_ ibans
  - ask the user to select the Sender
  - ask the user to add the `amount`
  - ask the user to add `Target IBAN`
    - here the FE check the IBAN
      - if it's a known IBAN, the `targetName` gets auto-filled and _disabled_
      - if it's a new IBAN, let the user add the `targetName`
  - ask the user to add `targetBic`
  - ask the user to add `reference`
- /account-balances - shows the list of accounts stored

### Backend

- /accounts returns accounts from JSON file
- /transfer handles money transfer:
  - Checks if the `only known IBANS` is true
    - if `YES` : only allows the transaction if the receiver's IBAN is in the account's list
    - if `NO` : allow all the transactions
  - Checks sender availability
    - Transfer goes through only if sender has enough money.
  - Creates log report
- /totalBalance returns the sum of the balances in the account-list

### Transfer Validation:

- if `amount` we are trying to move is bigger than availability - raise an _Error_
- if the entire form is empty - raise an _Error_

### UI

Minimalistic UI

------------------------------------------

## INFRA

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
