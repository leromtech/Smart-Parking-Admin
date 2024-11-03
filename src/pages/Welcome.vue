<template>

    <div class="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50 relative flex flex-col">

        <Head title="Welcome" />
        <NavBar v-model:login-dialog="loginDialogOpen" v-model:register-dialog="registerDialogOpen" />
        <section class="">
            <div class="px-2 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div class="flex flex-col items-center justify-between lg:flex-row">
                    <div class="mb-10 lg:max-w-lg lg:pr-5 lg:mb-0">
                        <div class="max-w-xl mb-6">

                            <h2
                                class="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Parking Just Got<br>
                                <span class="inline-block text-deep-purple-accent-400">A Lot Simpler.</span>
                            </h2>
                            <p class="text-base text-gray-700 md:text-lg sm:text-2xl">
                                Avoid getting late by finding a parking spot near you. Reserve your spot and enjoy
                                hassle free parking.
                            </p>
                        </div>

                        <div class="flex items-center space-x-3">
                            <a href="/" class="w-32 transition duration-300 hover:shadow-lg">
                                <img src="https://kitwind.io/assets/kometa/google-play.png"
                                    class="object-cover object-top w-full h-auto mx-auto" alt="" />
                            </a>
                            <a href="/" class="w-32 transition duration-300 hover:shadow-lg">
                                <img src="https://kitwind.io/assets/kometa/app-store.png"
                                    class="object-cover object-top w-full h-auto mx-auto" alt="" />
                            </a>
                        </div>
                    </div>
                    <div class="relative lg:w-1/2">
                        <iframe width="100%" height="315"
                            src="https://www.youtube.com/embed/k2y_Pzl_OVs?si=xaY285RL_Mo8uwZJ?autoplay=0&controls=0&showinfo=0&fs=0"
                            frameborder="0"
                            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen></iframe>

                    </div>
                </div>
            </div>

        </section>

        <section class="h-auto bg-white tails-selected-element">
            <div class="px-10 py-24 mx-auto max-w-7xl">
                <div class="w-full mx-auto text-left md:text-center">
                    <h1
                        class="mb-6 text-5xl font-extrabold leading-none max-w-5xl mx-auto tracking-normal text-gray-900 sm:text-6xl md:text-6xl lg:text-7xl md:tracking-tight">
                        <span
                            class="w-full text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 lg:inline">Why
                            Smart Parking?</span>
                    </h1>
                    <p class="px-0 mb-6 text-lg text-gray-600 md:text-2xl lg:px-24"> You’ve got place to be. Smart
                        Parking will help you get there faster. Our free app makes it easy to Find and Pay for parking,
                        rest of the things will be taken care by the parking manager. You can reserve spot ahead of time
                        to make sure you get the spot, such as in the event of concert and sporting events. With more
                        than a sufficient spot registered, Smart Parking gives you a smarter way to park when you’re on
                        the go.</p>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white tails-selected-element">
            <div class="container max-w-6xl mx-auto">
                <h2 class="text-4xl font-bold tracking-tight text-center">Our Features</h2>
                <p class="mt-2 text-lg text-center text-gray-600">Check out our list of awesome features below.</p>
                <div class="grid grid-cols-4 gap-8 mt-10 sm:grid-cols-8 lg:grid-cols-12 sm:px-8 xl:px-0">

                    <div class="relative flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 overflow-hidden bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 " viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                <path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"></path>
                                <circle cx="6" cy="14" r="3"></circle>
                                <path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"></path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Park with Ease</h4>
                        <p class="text-base text-center text-gray-500">The manager will not only park your vehicle on
                            the slot allotted, you can also opt for features available in that parking space.</p>
                    </div>

                    <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 " viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M18 8a3 3 0 0 1 0 6"></path>
                                <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
                                <path
                                    d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8">
                                </path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Online Payment</h4>
                        <p class="text-base text-center text-gray-500">Conveniently you can purchase parkcoin which will
                            be used for booking or parking, else you can pay using Gpay, PayTM & other online mode.</p>
                    </div>

                    <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 " viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                                <line x1="12" y1="12" x2="20" y2="7.5"></line>
                                <line x1="12" y1="12" x2="12" y2="21"></line>
                                <line x1="12" y1="12" x2="4" y2="7.5"></line>
                                <line x1="16" y1="5.25" x2="8" y2="9.75"></line>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Logs</h4>
                        <p class="text-base text-center text-gray-500">High-quality log files to help you out trace back
                            your transaction.</p>
                        <p></p>
                    </div>

                    <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 " viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M8 9l3 3l-3 3"></path>
                                <line x1="13" y1="15" x2="16" y2="15"></line>
                                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Time Saver</h4>
                        <p class="text-base text-center text-gray-500">Save time by find, book and pay for your parking
                            in advance. All you need is to download our parking mobile app.</p>
                    </div>

                    <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <line x1="9.5" y1="11" x2="9.51" y2="11"></line>
                                <line x1="14.5" y1="11" x2="14.51" y2="11"></line>
                                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
                                <path
                                    d="M7 5h1v-2h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3v1h-10v-1a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3"
                                    class=""></path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Safe and Secure</h4>
                        <p class="text-base text-center text-gray-500">It adheres to all required governmental rules and
                            regulations. The manager are trained professional to handle your parking.</p>
                    </div>

                    <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 sm:rounded-xl"
                        data-rounded="rounded-xl" data-rounded-max="rounded-full">
                        <div class="p-3 text-white bg-blue-500 rounded-full" data-primary="blue-500"
                            data-rounded="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <line x1="15" y1="5" x2="15" y2="7"></line>
                                <line x1="15" y1="11" x2="15" y2="13"></line>
                                <line x1="15" y1="17" x2="15" y2="19"></line>
                                <path
                                    d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2">
                                </path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-medium text-gray-700">Tickets</h4>
                        <p class="text-base text-center text-gray-500">Tickets system to provide special offers and
                            discounts for you.</p>
                    </div>

                </div>
            </div>
            <div class="tails-hover-element"></div>
        </section>

        <section class="w-full py-12 bg-white lg:py-24 tails-selected-element">
            <div class="max-w-6xl px-12 mx-auto text-center">
                <div class="space-y-12 md:text-center">
                    <div class="max-w-3xl mb-20 space-y-5 sm:mx-auto sm:space-y-4">
                        <h2 class="relative text-4xl font-extrabold tracking-tight sm:text-5xl">Our Awesome Team</h2>
                        <p class="text-xl text-gray-500">We take pride in the people we work with. This is because we
                            all collectively help each other become more awesome every day.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="w-full border border-gray-200 rounded-lg shadow-sm">
                        <div class="flex flex-col items-center justify-center p-10">
                            <img class="w-32 h-32 mb-6 rounded-full"
                                src="https://cdn.devdojo.com/images/june2021/headshot2.jpg">
                            <h2 class="text-lg font-medium">Dr. Vanlalruata Hnamte</h2>
                            <p class="font-medium text-blue-500">Senior Project Associate</p>
                            <p class="text-gray-400">Team member as of 2024</p>
                        </div>
                    </div>

                    <div class="w-full border border-gray-200 rounded-lg shadow-sm">
                        <div class="flex flex-col items-center justify-center p-10">
                            <img class="w-32 h-32 mb-6 rounded-full"
                                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1700&amp;q=80">
                            <h2 class="text-lg font-medium">Mr. C. Laldinsanga</h2>
                            <p class="font-medium text-blue-500">Project Associate</p>
                            <p class="text-gray-400">Team member as of 2024</p>
                        </div>
                    </div>

                    <div class="w-full border border-gray-200 rounded-lg shadow-sm">
                        <div class="flex flex-col items-center justify-center p-10">
                            <img class="w-32 h-32 mb-6 rounded-full"
                                src="https://cdn.devdojo.com/images/june2021/headshot-n.jpg">
                            <h2 class="text-lg font-medium">Mr. Isaac Chuaungo</h2>
                            <p class="font-medium text-blue-500">Project Associate</p>
                            <p class="text-gray-400">Team member as of 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="flex items-center justify-center py-20 bg-white min-w-screen tails-selected-element">
            <div class="px-16 bg-white">
                <div class="container flex flex-col items-start mx-auto lg:items-center">
                    <p class="relative flex items-start justify-start w-full text-lg font-bold tracking-wider text-purple-500 uppercase lg:justify-center lg:items-center"
                        data-primary="purple-500">Don't just take our word for it</p>


                    <h2
                        class="relative flex items-start justify-start w-full max-w-3xl text-5xl font-bold lg:justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            class="absolute right-0 hidden w-12 h-12 -mt-2 -mr-16 text-gray-200 lg:inline-block"
                            viewBox="0 0 975.036 975.036">
                            <path
                                d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z">
                            </path>
                        </svg>
                        See what others are saying
                    </h2>
                    <div class="block w-full h-0.5 max-w-lg mt-6 bg-purple-100 rounded-full" data-primary="purple-600">
                    </div>

                    <div class="items-center justify-center w-full mt-12 mb-4 lg:flex">
                        <div class="flex flex-col items-start justify-start w-full h-auto mb-12 lg:w-1/3 lg:mb-0">
                            <div class="flex items-center justify-center">
                                <div class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                                    <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1700&amp;q=80"
                                        class="object-cover w-full h-full">
                                </div>
                                <div class="flex flex-col items-start justify-center">
                                    <h4 class="font-bold text-gray-800">Lalvensanga</h4>
                                    <p class="text-gray-600">Customer</p>
                                </div>
                            </div>
                            <blockquote class="mt-8 text-lg text-gray-500">"I am stumbled upon this app while parking at
                                the civil hospital. My first use was one week back, but the service seems brilliant on
                                initial impression itself. The service was efficient in nature, and a lot more easier
                                than I ever expected, and convenient beyond my expectation. Looking goods, I could also
                                see the ad dons on features for my parking space."</blockquote>
                        </div>
                        <div
                            class="flex flex-col items-start justify-start w-full h-auto px-0 mx-0 mb-12 border-l border-r border-transparent lg:w-1/3 lg:mb-0 lg:px-8 lg:mx-8 lg:border-gray-200">
                            <div class="flex items-center justify-center">
                                <div class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                                    <img src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2547&amp;q=80"
                                        class="object-cover w-full h-full">
                                </div>
                                <div class="flex flex-col items-start justify-center">
                                    <h4 class="font-bold text-gray-800">Jane Doe</h4>
                                    <p class="text-gray-600">CTO of Business</p>
                                </div>
                            </div>
                            <blockquote class="mt-8 text-lg text-gray-500">"Thanks for creating this service. My life is
                                so much
                                easier.
                                Thanks for making such a great product."</blockquote>
                        </div>
                        <div class="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
                            <div class="flex items-center justify-center">
                                <div class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                                    <img src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1256&amp;q=80"
                                        class="object-cover w-full h-full">
                                </div>
                                <div class="flex flex-col items-start justify-center">
                                    <h4 class="font-bold text-gray-800">John Smith</h4>
                                    <p class="text-gray-600">Creator of Stuff</p>
                                </div>
                            </div>
                            <blockquote class="mt-8 text-lg text-gray-500">"Packed with awesome content and exactly what
                                I was
                                looking
                                for. I would highly recommend this to anyone."</blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-white smart-parking-selected-element">
            <div class="px-8 mx-auto max-w-7xl lg:px-16">
                <h2 class="mb-4 text-xl font-bold md:text-3xl">Frequently Asked Questions</h2>
                <div class="grid grid-cols-1 gap-0 text-gray-600 md:grid-cols-2 md:gap-16">
                    <div class="">
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">What is Smart Parking?</h5>
                        <p>Smart Parking is an advanced parking management system that utilizes technology to optimize
                            parking space utilization, provide real-time parking availability information, and
                            streamline the parking experience for users.</p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">Can I try it for Free?</h5>
                        <p>Yes, you can try out Smart Parking for free with all the features enabled.</p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">How do I pay for parking using the app?</h5>
                        <p>
                            To pay for parking, simple open the app, select your location, choose the duration, and
                            proceed to payment using your preferred method, such as Debit/Credit Card, UPI - GPay,
                            PayTM, PhonePe, etc., or your ParkCoin Wallet.
                        </p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">Can I reserve a parking spot in advance using
                            the app?</h5>
                        <p>
                            You can reserve a parking spot for yourself with the booking feature.
                        </p>
                    </div>
                    <div>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">Is there a map feature to help me find the
                            available parking spots?</h5>
                        <p>The application will guide you by giving precise directions to your parking destination.</p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">What is the license for Smart Parking?</h5>
                        <p>With Smart Parking, you have a license to utilize the system within your project. However,
                            redistribution or resale of the Smart Parking system is not permitted.</p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">Can I cancel my Smart Parking account?</h5>
                        <p>Yes, you can cancel your Smart Parking account at any time. Your access to the platform will
                            be terminated upon cancellation.</p>
                        <h5 class="mt-10 mb-3 font-semibold text-gray-900">What if I need help with Smart Parking
                            integration?</h5>
                        <p>If you require assistance with integrating Smart Parking into your project, you can reach out
                            to our support team for guidance and assistance.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white tails-selected-element">
            <div class="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl xl:text-6xl">
                    The New Standard for Parking Vehicle
                </h2>
                <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Use our award-winning tools to help you maximize your parking time. We've uncovered the correct
                    recipe for converting your time into better one.
                </p>
                <div class="flex justify-center mt-8 space-x-3">
                    <a href="#"
                        class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow hover:bg-indigo-700"
                        data-primary="indigo-600" data-rounded="rounded-md">Sign Up Today</a>
                    <a href="#"
                        class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                        data-primary="indigo-600" data-rounded="rounded-md">Learn more</a>
                </div>
            </div>
        </section>

        <section class="w-full bg-white tails-selected-element">
            <div class="mx-auto max-w-7xl">
                <div class="flex flex-col lg:flex-row">
                    <div
                        class="relative w-full bg-cover lg:w-6/12 xl:w-7/12 bg-gradient-to-r from-white via-white to-gray-100">
                        <div
                            class="relative flex flex-col items-center justify-center w-full h-full px-10 my-20 lg:px-16 lg:my-0">
                            <div class="flex flex-col items-start space-y-8 tracking-tight lg:max-w-3xl">
                                <div class="relative">
                                    <p class="mb-2 font-medium text-gray-700 uppercase">Work smarter</p>
                                    <h2 class="text-5xl font-bold text-gray-900 xl:text-6xl">Are you owning a parking
                                        space?</h2>
                                </div>
                                <p class="text-2xl text-gray-700">We've created a simple application form to follow in
                                    order to validate your application and get it ready for real-time in the market.</p>
                                <a href="#_"
                                    class="inline-block px-8 py-5 text-xl font-medium text-center text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 ease"
                                    data-primary="blue-600" data-rounded="rounded-lg">Get Started Today</a>
                            </div>
                        </div>
                    </div>

                    <div class="w-full bg-white lg:w-6/12 xl:w-5/12">
                        <div class="flex flex-col items-start justify-start w-full h-full p-10 lg:p-16 xl:p-24">
                            <h4 class="w-full text-3xl font-bold">Signup</h4>
                            <p class="text-lg text-gray-500">or, if you have an account you can <a href="#_"
                                    class="text-blue-600 underline" data-primary="blue-600">sign in</a></p>
                            <div class="relative w-full mt-10 space-y-8">
                                <div class="relative">
                                    <label class="font-medium text-gray-900">Name</label>
                                    <input type="text"
                                        class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 text-black"
                                        data-primary="blue-600" data-rounded="rounded-lg" placeholder="Enter Your Name">
                                </div>
                                <div class="relative">
                                    <label class="font-medium text-gray-900">Email</label>
                                    <input type="email"
                                        class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 text-black"
                                        data-primary="blue-600" data-rounded="rounded-lg"
                                        placeholder="Enter Your Email Address">
                                </div>
                                <div class="relative">
                                    <label class="font-medium text-gray-900">Password</label>
                                    <input type="password"
                                        class="block w-full px-4 py-4 mt-2 text-xl placeholder-gray-400 bg-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-opacity-50 text-black"
                                        data-primary="blue-600" data-rounded="rounded-lg" placeholder="Password">
                                </div>
                                <div class="relative">
                                    <a href="#_"
                                        class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 ease"
                                        data-primary="blue-600" data-rounded="rounded-lg">Create Account</a>
                                    <a href="#_"
                                        class="inline-block w-full px-5 py-4 mt-3 text-lg font-bold text-center text-gray-900 transition duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 ease"
                                        data-rounded="rounded-lg">Sign up with Google</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-white tails-selected-element">
            <div class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                <nav class="flex flex-wrap justify-center -mx-5 -my-2">
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            About
                        </a>
                    </div>
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            Application
                        </a>
                    </div>
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            Team
                        </a>
                    </div>
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            Pricing
                        </a>
                    </div>
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            Contact
                        </a>
                    </div>
                    <div class="px-5 py-2">
                        <a href="#" class="text-base leading-6 text-gray-500 hover:text-gray-900">
                            Terms
                        </a>
                    </div>
                </nav>

                <p class="mt-8 text-base leading-6 text-center text-gray-400">&copy; 2024 Smart Parking. All rights
                    reserved.</p>

            </div>
        </section>

        <Login v-model:open="loginDialogOpen" class="absolute flex" />

        <Modal v-model:open="registerDialogOpen">
            <Register class="lg:w-[30%] w-[95%]" @close="registerDialogOpen = false" />
        </Modal>
    </div>
</template>

<script setup>
import Login from '../components/Login.vue';
import NavBar from '../layouts/Navbar.vue';
import { ref, watch } from 'vue';
import Modal from '../components/Modal.vue';
import Register from '../components/Register.vue';


const loginDialogOpen = ref(false)
const registerDialogOpen = ref(false)
</script>