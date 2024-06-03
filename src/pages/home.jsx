import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

import { Logo } from '../components/Logo';
import { Container } from '../components/Container';
import { NavLink } from '../components/Link';
import { TicketBundles } from '../components/TicketBundles';
import { Header } from '../components/Header';
import { Fragment } from 'react';

const Page = () => {
  return (
    <Fragment>
      <Header />
      <News />
      <Home />
      <Products />
      <Testimonials />
      <TicketBundles />
      <ProductDetails1 />
      <ProductDetails2 />
      <FAQ />
      <CTA />
      <Footer />
    </Fragment>
  );
};

export default Page;

function News() {
  return (
    <div className="flex items-center gap-x-6 bg-black px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <a href="#">The Prize Draw closes on 7th July 2024 at 3pm, GMT.</a>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="relative bg-blue-white">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <img
              className="h-11"
              src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/b6c651d4-9ebc-4eff-a8eb-43f1a1270733-Logo%20001.png"
              alt="Your Company"
            />
            <div className="hidden sm:mt-32 sm:flex lg:mt-16">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Support the Arsenal Foundation's mission to help young people
                fulfil their potential.{' '}
                <a
                  href="#secure-the-legacy"
                  className="whitespace-nowrap font-semibold text-[#988352]"
                >
                  <span className=" absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Win the Ultimate Matchday Experience.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience match day at the Emirates Stadium in style. Enjoy a
              Champions League night under the lights, and get the VIP
              treatment.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#tickets"
                className="rounded-md bg-[#DD2F21] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DD2F21]-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Enter the Draw
              </a>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:ml-20 xl:mr-0">
          <img
            className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/ad61c1b3-d04e-44da-80f0-78a2bb349f1c-Hero%20Image.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

const products = [
  {
    id: 1,
    name: `First Prize: Win a VIP Champions League Group Game Experience at Emirates Stadium. Soak up the electric atmosphere and enjoy world-class football in ultimate style.`,
    color: 'Natural',
    price: '',
    href: '#',
    imageSrc:
      'https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/d72de577-648f-4886-a652-f390f84a8863-Prize%201.jpg',
    imageAlt: 'Hand stitched, orange leather long wallet.',
  },
  {
    id: 2,
    name: `Second Prize: Win tickets for two to watch the Gunners at the Emirates for one of our Premier League fixtures, and bag some exclusive Arsenal memorabilia.`,
    color: 'Black',
    price: '',
    href: '#',
    imageSrc:
      'https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/7fd670f9-467a-4f72-943f-9f48204646a9-Prize%202.jpg',
    imageAlt: 'Machined steel desk object with black powder coat finish.',
  },
  {
    id: 3,
    name: `Third Prize: Win a men's 24/25 squad signed Arsenal shirt along with a matchday programme of your choice.`,
    color: 'White',
    price: '',
    href: '#',
    imageSrc:
      'https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/9850f79c-160f-451c-8ff6-770958cd8eb9-Prize%203.jpg',
    imageAlt: 'Side of white leather sneaker.',
  },
];

function Products() {
  return (
    <div className="bg-yellow-white" id="prizes">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Prizes Include
          </h2>
          <a
            href="/#tickets"
            className="hidden text-sm font-medium text-white hover:text-indigo-500 md:block"
            onClick={() => document.getElementById('tickets')?.scrollIntoView()}
          >
            Enter the Draw <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-sm text-white">
                <p>
                  <span className="absolute inset-0" />
                  {product.name}
                </p>
              </h3>
              {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
              <p className="mt-1 text-sm font-medium text-gray-900">
                {product.price}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Enter the Draw
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="bg-[#ffffff] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-[#000000]">
                <p>
                  "We know that the power of the Arsenal name can open doors to
                  young people who may otherwise be lost to society."
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  className="h-14 w-14 rounded-full bg-gray-800"
                  src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/2ca91c84-a6f1-464f-8909-70c48315f034-Wenger.png"
                  alt=""
                />
                <div className="text-base">
                  <div className="font-semibold text-white">Arsène Wenger</div>
                  <div className="mt-1 text-gray-400">
                    Former Arsenal Manager and Arsenal Foundation Ambassador.
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col border-t border-white/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-[#000000]">
                <p>
                  "I’m so proud that Arsenal and Save the Children are making
                  such a difference to so many children’s lives. It was truly
                  inspiring to see the power that football can have."
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  className="h-14 w-14 rounded-full bg-gray-800"
                  src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/a028163a-8e82-4adf-b883-57df36b4f3c2-Scott.png"
                  alt=""
                />
                <div className="text-base">
                  <div className="font-semibold text-white">Alex Scott MBE</div>
                  <div className="mt-1 text-gray-400">
                    Former Player. Arsenal Foundation Ambassador
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDetails1() {
  return (
    <div className="overflow-hidden bg-white-grey py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-[#DD2F21]">
                Win Exclusive Access
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Win the Ultimate Champions League Experience at the Emirates
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Get ready for an unforgettable Champions League night at
                Emirates Stadium! After a thrilling Premier League season that
                went down to the wire, Arsenal have once again secured their
                place among Europe's elite. Now, you have the chance to
                experience the electric atmosphere of a crucial group stage
                match in ultimate style.
              </p>{' '}
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Building on last season's impressive knockout stage performance,
                the Gunners are determined to make their mark on the continent.
                With the VIP treatment, you'll be at the heart of the action as
                Arsenal take on one of Europe's top teams under the floodlights.
                Soak up the pre-match excitement, watch the players arrive, and
                feel the anticipation build as kick-off approaches.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                As a VIP guest, you'll enjoy the best seats in the house, with
                unrivaled views of the pitch and the opportunity to witness
                world-class football up close. Immerse yourself in the passion
                and energy of the crowd as Arsenal battle for supremacy in the
                group stage, aiming to secure their place in the knockout rounds
                and surpass last season's achievements.
              </p>{' '}
              <p className="mt-6 text-lg leading-8 text-gray-600">
                This is your chance to be part of Arsenal's European journey, as
                they strive to etch their name in Champions League history.
                Don't miss this incredible opportunity to experience a memorable
                night of Champions League football at Emirates Stadium, where
                dreams are made and legends are born.
              </p>
            </div>
          </div>
          <div className="flex items-start justify-center sm:justify-end lg:order-first">
            <img
              src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/d5268ff7-d1f7-49e2-bcc3-51487496e9f3-Experience%20Image.jpg"
              alt="Product screenshot"
              className="w-full sm:w-[48rem] md:w-[57rem] lg:w-[64rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetails2() {
  return (
    <div
      id="secure-the-legacy"
      className="overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-[#DD2F21]">
                Support the Foundation
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Help the Arsenal Foundation Shape the Lives of Young People
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Nestled in the heart of London, the Handel and Hendrix Museum is
                a unique cultural gem that celebrates the lives and legacies of
                two musical icons: George Frideric Handel and Jimi Hendrix. This
                historic building, once home to Hendrix himself, now houses an
                extraordinary collection of memorabilia and artefacts, including
                the newly acquired Jimi Hendrix Archive.
              </p>{' '}
              <p className="mt-6 text-lg leading-8 text-gray-600">
                By participating in this exclusive prize draw, you not only have
                the chance to win unparalleled experiences and prizes, but you
                also play a vital role in ensuring that this remarkable archive
                remains permanently housed at the museum, accessible to music
                enthusiasts, researchers, and the public for generations to
                come. Your support will help preserve and showcase Hendrix's
                enduring influence, guaranteeing that his groundbreaking
                artistry continues to inspire and shape the course of music
                history.
              </p>
            </div>
          </div>
          <img
            src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/48959e61-050e-447b-bb03-9e46177820bf-Cause%20Image.jpg"
            alt="Product screenshot"
            className="w-full sm:w-[48rem] md:w-[57rem] lg:w-[64rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'How do you make sure the prize draw is fair and transparent?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'Are there any age restrictions for participants?',
      answer:
        'You planet. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
    },
    {
      question: 'Can I gift my winnings or tickets to someone else?',
      answer:
        'Because every play has a cast. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
    },
    {
      question: 'How is my privacy protected?',
      answer:
        'Because he was outstanding in his field. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
    },
  ];
  return (
    <div className="bg-white" id="faqs">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusSmallIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
function CTA() {
  return (
    <div className="bg-whiter-blue py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="max-w-xl text-3xl font-bold tracking-tight text-black sm:text-4xl lg:col-span-7">
          <h2 className="inline sm:block lg:inline xl:block">
            Hear more about the prize draw.
          </h2>
          <br />{' '}
          <p className="inline sm:block lg:inline xl:block">
            Sign up for our newsletter.
          </p>
        </div>
        <form className="w-full max-w-md text-black lg:col-span-5 lg:pt-2">
          <div className="flex gap-x-4">
            <label htmlFor="email-address" className="sr-only  text-black">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="text-black min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-black/75 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="text-[#988352] flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-black">
            We care about your data. Read our{' '}
            <a
              href="#"
              className="font-semibold text-black hover:text-indigo-50"
            >
              privacy&nbsp;policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="/start-fundraising">Start Fundraising</NavLink>
              <NavLink href="/for-players">For Players</NavLink>
              <NavLink href="/find-draw">Find a Draw</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <a href="#" className="group" aria-label="PlayFundWin on X">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z" />
              </svg>
            </a>
            <a href="#" className="group" aria-label="PlayFundWin on GitHub">
              <svg
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} PlayFundWin. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
