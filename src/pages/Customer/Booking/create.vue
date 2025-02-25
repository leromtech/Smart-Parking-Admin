<template>
    <div class="flex flex-col w-[90%] h-[70%] p-4 bg-[#0B0B0B] rounded-lg border-white border">
        <div class="w-full flex flex-col h-full items-center justify-between">
            <div class="w-full gap-8 flex flex-col">
                <div class="w-[100%] h-[300px] bg-stone-600 rounded-lg">
                    <img src="" alt="">
                </div>
                <div class="flex flex-col gap-4 w-full">
                    <p>{{ item.name }}</p>
                    <div class="flex flex-row justify-between">
                        <p>Location</p>
                        <p>{{ item.address }}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Availability</p>
                        <p>{{ item.availability.real_time_availability }}</p>
                    </div>
                    <div class="flex flex-col">
                        <p>Rate</p>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-between">
                <button class="w-[48%] border p-2 text-[14px] border-[#7F00FF] bg-[#7F00FF] text-white">Continue to
                    Book</button>
                <button class="w-[48%] border border-[#7F00FF] p-2 text-[14px]">Start Navigation</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import useBooking from '../../../scripts/customer/booking';

const props = defineProps(['item'])

const {booking} = useBooking()
</script>