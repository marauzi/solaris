const axios = require('axios');

const CURRENCY = 'GBP';
const CACHE_KEY_TOKEN = 'paypalToken';

module.exports = class PaypalService {

    API = {
        sandbox: {
            auth: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            payment: 'https://api-m.sandbox.paypal.com/v1/payments/payment',
            execute: (paymentId) => `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
            capture: (authorizationId) => `https://api-m.sandbox.paypal.com/v1/payments/authorization/${authorizationId}/capture`
        },
        production: {
            auth: 'https://api-m.paypal.com/v1/oauth2/token',
            payment: 'https://api-m.paypal.com/v1/payments/payment',
            execute: (paymentId) => `https://api-m.paypal.com/v1/payments/payment/${paymentId}/execute`,
            capture: (authorizationId) => `https://api-m.paypal.com/v1/payments/authorization/${authorizationId}/capture`
        }
    };

    constructor (PaymentModel, paymentRepo, userService, cacheService) {
        this.PaymentModel= PaymentModel;
        this.paymentRepo = paymentRepo;
        this.userService = userService;
        this.cacheService = cacheService;
    }

    async authorize() {
        let cached = this.cacheService.get(CACHE_KEY_TOKEN);

        if (cached) {
            return cached;
        }

        const environment = process.env.PAYPAL_ENVIRONMENT;

        const params = new URLSearchParams()
        params.append('grant_type', 'client_credentials')

        let authResponse = await axios.post(this.API[environment].auth, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET
            }
        });

        let token = authResponse.data.access_token;

        this.cacheService.put(CACHE_KEY_TOKEN, token, 3600000); // 1 hour

        return token;
    }

    async authorizePayment(userId, totalQuantity, totalCost, unitCost, returnUrl, cancelUrl) {
        const environment = process.env.PAYPAL_ENVIRONMENT;

        // Get a token from PayPal
        let token = await this.authorize();
        const requestOptions = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        // Authorize a payment
        let paymentResponse = await axios.post(this.API[environment].payment, {
            intent: 'authorize',
            payer: {
                payment_method: "paypal"
            },
            transactions: [
                {
                    amount: {
                        total: totalCost.toFixed(2),
                        currency: CURRENCY
                    },
                    description: `${totalQuantity} Galactic Tokens on Solaris`,
                    item_list: {
                        items: [
                            {
                                name: "Galactic Tokens",
                                quantity: totalQuantity,
                                price: unitCost.toFixed(2),
                                currency: CURRENCY
                            }
                        ]
                    }
                }
            ],
            note_to_payer: "Contact us for any questions on your order.",
            redirect_urls: {
                return_url: returnUrl,
                cancel_url: cancelUrl
            }
        }, requestOptions);

        // Create a payment in the database against the user so it can be retrieved later when processing the payment.
        let payment = new this.PaymentModel({
            userId,
            paymentId: paymentResponse.data.id,
            totalCost,
            totalQuantity,
            unitCost
        });

        await payment.save();

        // Redirect the user to the authorize URL
        let approvalUrl = paymentResponse.data.links.find(l => l.rel === 'approval_url').href;

        return approvalUrl;
    }

    async processPayment(paymentId, payerId) {
        const environment = process.env.PAYPAL_ENVIRONMENT;
        
        // Get the payment from the DB to verify transaction.
        const payment = await this.paymentRepo.findOne({
            paymentId
        });

        if (!payment) {
            throw new Error(`Payment not found with id: ${paymentId}`);
        }

        // Get a token from PayPal
        let token = await this.authorize();
        const requestOptions = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        // Execute the approved payment
        let executeResponse = await axios.post(this.API[environment].execute(paymentId), {
            payer_id: payerId
        }, requestOptions);

        for (let transaction of executeResponse.data.transactions) {
            const authorizationId = transaction.related_resources.find(r => r.authorization != null).authorization.id;

            // Capture the payment.
            await axios.post(this.API[environment].capture(authorizationId), {
                amount: {
                    total: parseFloat(transaction.amount.total).toFixed(2),
                    currency: transaction.amount.currency
                }
            }, requestOptions);
        }

        // Add credits to the users account.
        await this.userService.incrementCreditsByPurchase(payment.userId, payment.totalQuantity);

        return {
            galacticTokens: payment.totalQuantity
        };
    }

};
