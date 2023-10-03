# XinaRides

## WARNING

Many of the variables in server .env file has been removed for privacy reasons, if you wish to run the code, I reccomend adding your own variables.

## Setup Instructions

1. Run `npm i` in both `/client` and `/server` folders to ensure that you have the latest packages installed.
2. Run `populate_data.sql` in MySQL to populate the database with test data. Make sure that the database name in the first three lines change if you happen to not name your database `xinarides`.
3. In `/client/.env`, fill in `VITE_API_BASE_URL` as the server URL.
4. In `/server/.env`, fill in all fields.
5. Download and setup [`ngrok`](https://ngrok.com/download).
6. Run `ngrok http 3001`. The URL provided should look something like `https://a123-456.ngrok.io`.
7. Create a new webhook endpoint at `<your ngrok URL>/webhook` (should look like `https://a123-456.ngrok.io/webhook`) listening to `checkout.session.completed` on Stripe [here](https://dashboard.stripe.com/test/developers).
8. Create a new webhook endpoint at `<your ngrok URL>/webhook/intent-hook` listening to `payment_intent.succeeded` on Stripe [here](https://dashboard.stripe.com/test/developers).
9. In `/server/routes/webhook`, change `endpointSecret` and `intentHookSecret` to the respective signing secrets from the Stripe dashboard.
10. Run `npm start` in both `/client` and `/server` folders to run the website.

## Defaults

-   There are 2 default accounts:
    -   The **user** "hyphen.codes@gmail.com" with password "hyphen.codes@gmail.com1".
        -   This account is currently renting bikes 1, 3, 4, 6, and 7.
        -   This account has 5 fault reports on 3, 4, 2, 3, and 6.
    -   The **admin** "xinarides@gmail.com" with password "xinarides@gmail.com1".
    -   Both default accounts do not have 2FA enabled, you must create a new account with an email you have access to, to test 2FA and email functionality.
-   In the User Dashboard, the "Bikes Near You" column is filtered to only bikes within a 2km radius of you.


