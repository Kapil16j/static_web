import React, { useState, useEffect } from 'react';
import Widget from './Widget'; // Import the Widget component

const PaymentForm = () => {
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    // Simulate receiving the formActionSnippet
    const formActionSnippet = {
      "action": "form",
      "formHtml": `<script type="application/json" id="stripe-parameters-qeyju7foafgoscxprw9mjttnmh8hggq4nzo6qsie">
        {
            "totalAmount": 115750,
            "currency": "sek",
            "country": "SE",
            "returnUrl": "http://localhost:3000/thank-you/?checkoutResult=success&centraPaymentMethod=stripe-intents",
            "countriesWithStates": ["AR", "AU", "BR", "CA", "CN", "DO", "IN", "ID", "IT", "JP", "MX", "GB", "US"],
            "paymentMethod": "stripe-intents"
        }
    </script>

    <div id="stripe-button-qeyju7foafgoscxprw9mjttnmh8hggq4nzo6qsie" class="stripe-payment-button" style="display: none"
        data-return-url="http://localhost:3000/thank-you/?checkoutResult=success&amp;centraPaymentMethod=stripe-intents"
        data-publishable-key="pk_test_51A04U6Kp4sYya5G5xByKO4xdod6gqSuWU9XbYBk1A7xCFDglR9DXXH5SGnOyov2CsF3TthSyJM3ktqSYe7loeXX000QOCyi5hD"
        data-secret="pi_3PRqSOKp4sYya5G51R08te6Z_secret_R1tIqShUUGOjA9wahlCT2ceNy">
    </div>

    <script>
        function loadStripe() {
            if (window.StripeIsLoading) {
                return;
            }
            if (typeof window.Stripe === 'function') {
                stripeButtonInit();
                return;
            }
            window.StripeIsLoading = true;
            var newScript = document.createElement('script');
            newScript.async = true;
            newScript.src = 'https://js.stripe.com/v3/';
            newScript.onload = stripeButtonInit;
            if (document.children) {
                document.children[0].appendChild(newScript);
            } else {
                document.body.parentNode.appendChild(newScript);
            }
        }

        function stripeButtonInit() {
            delete window.StripeIsLoading;
            var randomId = 'qeyju7foafgoscxprw9mjttnmh8hggq4nzo6qsie';
            var button = document.getElementById('stripe-button-' + randomId);
            var paymentData = JSON.parse(document.getElementById('stripe-parameters-' + randomId).textContent);
            var stripe = Stripe(button.dataset.publishableKey);
            var elements = stripe.elements();
            var buttonElement = window.stripeRequestButtonSelector || '#stripe-button-' + randomId;

            var paymentRequest = stripe.paymentRequest({
                country: paymentData.country,
                currency: paymentData.currency,
                total: {
                    label: 'Total',
                    amount: paymentData.totalAmount,
                },
                requestPayerName: true,
                requestPayerEmail: true,
                requestPayerPhone: true,
                requestShipping: true,
                shippingOptions: []
            });

            var countryHasState = function(countryCode) {
                return paymentData.countriesWithStates.includes(countryCode.toUpperCase());
            };

            paymentRequest.on('paymentmethod', function(event) {
                var billingHasState = countryHasState(event.paymentMethod.billing_details.address.country);
                var shippingHasState = countryHasState(event.shippingAddress.country);
                var eventObject = {
                    responseEventRequired: false,
                    addressIncluded: true,
                    paymentMethodSpecificFields: {
                        payment_method_id: event.paymentMethod.id
                    },
                    paymentMethod: paymentData.paymentMethod,
                    billingAddress: {
                        firstName: event.payerName,
                        lastName: ' ', // no information about this,
                        address1: event.paymentMethod.billing_details.address.line1,
                        address2: event.paymentMethod.billing_details.address.line2,
                        zipCode: event.paymentMethod.billing_details.address.postal_code,
                        state: billingHasState ? event.paymentMethod.billing_details.address.state : '',
                        country: event.paymentMethod.billing_details.address.country,
                        city: event.paymentMethod.billing_details.address.city,
                        phoneNumber: event.payerPhone,
                        email: event.payerEmail
                    },
                    shippingAddress: {
                        firstName: event.shippingAddress.recipient,
                        lastName: ' ', // no information about this,
                        address1: event.shippingAddress.addressLine.shift(),
                        address2: event.shippingAddress.addressLine.join(' ') || null,
                        city: event.shippingAddress.city,
                        zipCode: event.shippingAddress.postalCode,
                        state: shippingHasState ? event.shippingAddress.region : '',
                        country: event.shippingAddress.country,
                        phoneNumber: event.shippingAddress.phone,
                        email: event.payerEmail
                    }
                };
                paymentCompleteEvent = new CustomEvent("centra_checkout_payment_callback", { detail: eventObject });
                document.dispatchEvent(paymentCompleteEvent);
                event.complete('success');
            });

            var updatePaymentRequest = function(event, origdata) {
                var currency = origdata.detail.currency;
                if (origdata.detail.error || !currency || paymentData.currency !== origdata.detail.currency.toLowerCase()) {
                    event.updateWith({ status: 'fail' });
                    return;
                }
                var selectedCountry = origdata.detail.country;
                var shippingMethods = Object.values(origdata.detail.shippingMethodsAvailable);
                var currencyDenominator = origdata.detail.currencyDenominator;
                var grandTotal = origdata.detail.grandTotalPriceAsNumber;
                var methods = [];
                for (var i = 0; i < shippingMethods.length; i++) {
                    var method = shippingMethods[i];
                    var methodObject = {
                        id: selectedCountry + '_' + method.shippingMethod,
                        label: method.name,
                        amount: parseInt(method.priceAsNumber * currencyDenominator, 10)
                    };
                    methods.push(methodObject);
                }
                if (!methods.length) {
                    event.updateWith({ status: 'fail' });
                    return;
                }
                event.updateWith({
                    shippingOptions: methods,
                    total: {
                        label: 'Total',
                        amount: parseInt(grandTotal * currencyDenominator, 10),
                    },
                    status: 'success',
                });
            };

            paymentRequest.on('shippingaddresschange', function(event) {
                var shippingHasState = countryHasState(event.shippingAddress.country);
                var eventObject = {
                    shippingCountry: event.shippingAddress.country,
                    shippingState: shippingHasState ? event.shippingAddress.region : '',
                    shippingZipCode: event.shippingAddress.postal_code
                };

                document.addEventListener(
                    'centra_checkout_shipping_address_response',
                    updatePaymentRequest.bind(null, event),
                    { once: true }
                );

                var paymentCompleteEvent = new CustomEvent("centra_checkout_shipping_address_callback", { detail: eventObject });
                document.dispatchEvent(paymentCompleteEvent);
            });

            paymentRequest.on('shippingoptionchange', function(event) {
                var shippingMethod = event.shippingOption.id.split('_');
                shippingMethod.shift();
                shippingMethod = shippingMethod.join('_');
                var eventObject = {
                    shippingMethod: shippingMethod
                };

                document.addEventListener(
                    'centra_checkout_shipping_method_response',
                    updatePaymentRequest.bind(null, event),
                    { once: true }
                );

                var paymentCompleteEvent = new CustomEvent("centra_checkout_shipping_method_callback", { detail: eventObject });
                document.dispatchEvent(paymentCompleteEvent);
            });

            var paymentRequestButton = elements.create('paymentRequestButton', {
                paymentRequest,
            });

            paymentRequest.canMakePayment().then(function(result) {
                if (!result) {
                    return;
                }
                paymentRequestButton.mount(buttonElement);
                button.style.display = '';
            });
        }

        loadStripe();
    </script>`,
      "formType": "stripe-payment-intents",
      "formFields": {
        "publishableKey": "pk_test_07,,,", 
        "stripeParameters": "{\"totalAmount\":20000,\"currency\":\"sek\",\"country\":\"SE\",\"returnUrl\":\"https:\\/\\/example.com\\/?centraPaymentMethod=stripe-pi\"}", 
        "externalScript": "https://js.stripe.com/v3/", 
        "clientSecret": "pi_1Gj0B9Kecatv..."
      }
    };

    // Update the state with the snippet
    setSnippet(formActionSnippet.formHtml);
  }, []); // Empty dependency array to run only once on mount

  if (!snippet) {
    return null;
  }

  return (
    <Widget snippet={snippet} evaluateDelay={300} />
  );
};

export default PaymentForm;
