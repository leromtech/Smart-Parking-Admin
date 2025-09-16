<template>
    <div class="flex flex-col items-center justify-center w-full h-dvh bg-slate-100">
        <form action="" class="border-2 p-6 bg-white rounded-lg shadow-md w-[25%] flex flex-col gap-3">
            <p class="font-bold">CONTACT US</p>
            <div class="flex flex-col gap-2">
                <label for="name" class="font-semibold">Name <span class="text-red-500 font-semibold">*</span></label>
                <input id="name" type="text" class="p-2 border-[#00000046] border-2">
            </div>
            <div class="flex flex-col gap-2">
                <label for="email" class="font-semibold">Email <span class="text-red-500 font-semibold">*</span></label>
                <input id="email" type="text" class="p-2 border-[#00000046] border-2">
            </div>
            <div class="flex flex-col gap-2">
                <label for="phone" class="font-semibold">Phone <span class="text-red-500 font-semibold">*</span></label>
                <input id="phone" type="text" class="p-2 border-[#00000046] border-2">
            </div>
            <div class="flex flex-col gap-2">
                <label for="message" class="font-semibold">Message <span
                        class="text-red-500 font-semibold">*</span></label>
                <textarea id="message" type="text" class="p-2 border-[#00000046] border-2" />
            </div>
            <button class="p-2 bg-blue-600 text-white mt-2 rounded-md hover:bg-blue-500">SUBMIT</button>
        </form>
    </div>
</template>