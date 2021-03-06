import 'isomorphic-fetch';
import '../styles/index.scss';
import React, { Component } from 'react';
import Head from 'next/head';
import StripeCheckout from 'react-stripe-checkout';
import post from '../lib/post';

const api = process.env.API;
const stripeKey = process.env.STRIPE_KEY;

const onToken = async ({ id }, amount, href) =>
{
    const res = await fetch(api + 'charge', post({ token: id, amount }));
    const data = await res.json();
    alert(`Thank you, $${ data.amount / 100 } charged.`);
    window.location.href = decodeURIComponent(href) + `?token=${ data.id }`;
};

export default class Pay extends Component
{
    state = { payment: 0 };

    static async getInitialProps({ query })
    {
        const { ref, amount } = query;
        return { href: ref, amount };
    }

    render()
    {
        const { payment } = this.state;
        const { href, amount } = this.props;
        return (
            <div className='row halign'>
                <Head>
                    <title>{ amount ? 'Pay' : 'Donate' } </title>
                    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                </Head>
                { amount && (
                    <StripeCheckout name='gerardvee.com' image='// gv logo' amount={ amount * 100 }
                        token={ (tkn) => onToken(tkn, amount * 100, href) } stripeKey={ stripeKey }
                    >
                        <button className='site-donate-donate-button'>Pay ${ amount }</button>
                    </StripeCheckout>) }
                { !amount && (
                    <div>
                        Donation amount (USD): <input value={ payment } onChange={ ({ target }) => this.setState({ payment: target.value }) }/>
                        <StripeCheckout name='gerardvee.com' image='// gv logo' amount={ payment * 100 }
                            token={ (tkn) => onToken(tkn, payment * 100, href) } stripeKey={ stripeKey }
                        >
                            <button className='site-donate-donate-button'>Donate</button>
                        </StripeCheckout>
                    </div>) }
            </div>
        );
    }
}