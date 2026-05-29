<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
                <h3 class="font-semibold text-lg m-0">{{ zoneName }}</h3>
                <p v-if="zoneAddress" class="text-sm text-gray-500 m-0">{{ zoneAddress }}</p>
            </div>
            <div class="flex flex-col text-sm">
                <span>
                    Settlement:
                    <Tag
                        :severity="status === 'Settled' ? 'success' : 'warn'"
                        :value="status || 'Unsettled'"
                    />
                </span>
                <span class="text-gray-600 mt-1">
                    Commission rate: {{ (commissionRate * 100).toFixed(1) }}%
                </span>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="rounded-lg border border-neutral-200 p-3 bg-white">
                <span class="text-xs text-gray-500 block">Parking earnings</span>
                <span class="font-semibold">₹ {{ formatMoney(totals?.parking) }}</span>
            </div>
            <div class="rounded-lg border border-neutral-200 p-3 bg-white">
                <span class="text-xs text-gray-500 block">Booking earnings</span>
                <span class="font-semibold">₹ {{ formatMoney(totals?.booking) }}</span>
            </div>
            <div class="rounded-lg border border-neutral-200 p-3 bg-white">
                <span class="text-xs text-gray-500 block">Grand total</span>
                <span class="font-semibold text-sky-700">₹ {{ formatMoney(grandTotal) }}</span>
            </div>
            <div class="rounded-lg border border-neutral-200 p-3 bg-white">
                <span class="text-xs text-gray-500 block">Zone share</span>
                <span class="font-semibold text-green-700">₹ {{ formatMoney(zoneShare) }}</span>
            </div>
        </div>

        <div v-if="activeFilterChips.length > 0" class="flex flex-wrap gap-2">
            <Tag v-for="chip in activeFilterChips" :key="chip.key" :value="chip.label" />
        </div>

        <div class="flex flex-col gap-2">
            <Panel :header="entry[0].toUpperCase()" v-for="entry in visiblePaymentEntries" :key="entry[0]">
                <DataTable
                    :value="entry[1]"
                    scrollable
                    scrollHeight="400px"
                    tableStyle="min-width: 50rem"
                    :loading="loading"
                >
                    <Column header="Receipt No.">
                        <template #body="slotProps">
                            {{ slotProps.data.receipt_number ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Payment Method">
                        <template #body="slotProps">
                            {{ slotProps.data.payment_method ?? '--' }}
                        </template>
                    </Column>
                    <Column header="Created at">
                        <template #body="slotProps">
                            <div class="text-end">{{ slotProps.data.created_at }}</div>
                        </template>
                    </Column>
                    <Column field="status" header="Status" />
                    <Column header="Vehicle Type">
                        <template #body="slotProps">
                            <div class="capitalize">
                                {{
                                    slotProps.data.payable?.vehicle_type?.name ||
                                    slotProps.data.payable?.vehicleType?.name ||
                                    slotProps.data.payable?.vehicle?.vehicle_type?.name ||
                                    slotProps.data.payable?.vehicle?.vehicleType?.name ||
                                    '--NA--'
                                }}
                            </div>
                        </template>
                    </Column>
                    <Column header="Amount">
                        <template #body="slotProps">
                            <div class="text-end">
                                {{
                                    (Number(slotProps.data.amount) || 0) !== 0
                                        ? (Number(slotProps.data.amount) || 0).toLocaleString('en-IN')
                                        : '-'
                                }}
                            </div>
                        </template>
                    </Column>
                    <Column header="Commission Share">
                        <template #body="slotProps">
                            <div class="text-end">
                                ₹ {{ ((slotProps.data.amount || 0) * commissionRate).toFixed(2) }}
                                ({{ (commissionRate * 100).toFixed(1) }}%)
                            </div>
                        </template>
                    </Column>
                    <Column header="Parking Zone Share">
                        <template #body="slotProps">
                            <div class="text-end">
                                ₹ {{ ((slotProps.data.amount || 0) * (1 - commissionRate)).toFixed(2) }}
                            </div>
                        </template>
                    </Column>

                    <template #footer>
                        <div class="flex justify-between p-2 font-bold">
                            <span>Total:</span>
                            <span class="text-end">₹ {{ formatMoney(totals?.[entry[0]]) }}</span>
                        </div>
                        <div class="flex justify-between p-2 font-bold text-sm text-neutral-500">
                            <span>Commission Share:</span>
                            <span class="text-end">
                                ₹ {{ ((totals?.[entry[0]] || 0) * commissionRate).toFixed(2) }}
                            </span>
                        </div>
                        <div class="flex justify-between p-2 font-bold text-sm text-neutral-500">
                            <span>Parking Zone Share:</span>
                            <span class="text-end">
                                ₹ {{ ((totals?.[entry[0]] || 0) * (1 - commissionRate)).toFixed(2) }}
                            </span>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center p-4 text-gray-500">No records found.</div>
                    </template>
                </DataTable>
            </Panel>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    zoneName: { type: String, default: '' },
    zoneAddress: { type: String, default: '' },
    payments: { type: Object, default: () => ({}) },
    totals: { type: Object, default: null },
    commissionRate: { type: Number, default: 0 },
    status: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    payableTypeFilter: { type: String, default: '' },
    activeFilterChips: { type: Array, default: () => [] },
});

const formatMoney = (value) => (Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const grandTotal = computed(() => Number(props.totals?.grand_total) || 0);
const zoneShare = computed(() => grandTotal.value * (1 - props.commissionRate));

const visiblePaymentEntries = computed(() => {
    const allEntries = Object.entries(props.payments || {});
    if (props.payableTypeFilter === 'parking') return allEntries.filter(([key]) => key === 'parking');
    if (props.payableTypeFilter === 'booking') return allEntries.filter(([key]) => key === 'booking');
    return allEntries;
});
</script>
