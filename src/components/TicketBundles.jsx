import React from 'react';
import { Link } from 'react-router-dom';

import { useSignup } from '../context/SignupProvider';
import { useState } from 'react';

export function TicketBundles() {
  const { amount, setAmount, entries, setEntries } = useSignup();

  const frequencies = [
    { value: 'monthly', label: 'Monthly', priceSuffix: '' },
    { value: 'annually', label: 'Annually', priceSuffix: '' },
  ];
  const [frequency, setFrequency] = useState(frequencies[0]);

  const tiers = [
    {
      name: '10 Tickets',
      id: 'tier-freelancer',
      href: '/signup',
      price: { monthly: 10, annually: 144 },
      entries: 10,
      description: 'Be in it to win it.',
      features: [
        '5 products',
        'Up to 1,000 subscribers',
        'Basic analytics',
        '48-hour support response time',
      ],
      mostPopular: false,
    },
    {
      name: '30 Tickets',
      id: 'tier-startup',
      href: '/signup',
      price: { monthly: 30, annually: 288 },
      entries: 30,
      description: 'Increase your chances to win.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      mostPopular: true,
    },
    {
      name: '70 Tickets',
      id: 'tier-enterprise',
      href: '/signup',
      price: { monthly: 50, annually: 576 },
      entries: 70,
      description: 'Amplify your chances to win.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
        'Custom reporting tools',
      ],
      mostPopular: false,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="bg-[#121826] py-24 sm:py-32" id="tickets">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-white">
            Win Big.
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-[#DD2F21] sm:text-5xl">
            Enter the Arsenal Prize Draw
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-[#ffffff]">
          Unlock greater chances to win with bigger ticket bundles!
        </p>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                'bg-white text-black rounded-3xl p-8 xl:p-10 '
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames('text-lg font-semibold leading-8')}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-[white] px-2.5 py-1 text-xs font-semibold leading-5 text-black">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className={classNames('mt-4 text-sm leading-6')}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={classNames('text-4xl font-bold tracking-tight')}
                >
                  £{tier.price[frequency.value]}
                </span>
              </p>
              <Link
                to={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  'bg-[#DD2F21] text-white hover:bg-white/20 focus-visible:outline-white mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
                onClick={() => {
                  setEntries(tier.entries);
                  setAmount(tier.price[frequency.value]);
                  console.log('Entries: ', entries);
                  console.log('Amount: ', amount);
                }}
              >
                Buy Now
              </Link>

              {/* <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-black xl:mt-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-black" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketBundles;
