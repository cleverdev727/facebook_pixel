# LOLA

[Website](https://mylola.com) |
[Blog](https://blog.mylola.com/) |
[Twitter](https://twitter.com/mylolatweet) |
[Facebook](https://www.facebook.com/lola)

LOLA is a feminine care brand offering tampons, pads, and now other products, including condoms, lubricant, and feminine cleansing wipes via a subscription service

* LOLA uses [Nacelle](https://docs.getnacelle.com/) for headless communication with [Shopify](https://www.shopify.com/).

## Table of Contents

1. [Installation and Usage](#installation-and-usage)
2. [Configuration](#configuration)
3. [Code of Conduct](CODE_OF_CONDUCT.md)
4. [Authors](#authors)
## <a name="installation-and-usage"></a>Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/) ( `>=12.0.0`) built with SSL support. (If you are using an official Node.js distribution, SSL is always built in.)

You can install project dependencies using npm.

```sh
$ npm install
```

## <a name="configuration"></a>Configuration
After installing the project you will need to create a dot env file `.env`, properties can be found under [.env.sample](.env.sample)

To run the project in `dev` mode:

```sh
$ npm run dev
```

To generate a static application:

```sh
$ npm run generate
$ npm start
```

NB: uses port `3000` by default


## <a name="authors"></a>Authors
- Abeeb Ola ([@abeebola](https://github.com/abeebola))
- George Otieno ([@jodge](https://github.com/jodge))
- John Ndero ([@ndero](https://github.com/ndero))
