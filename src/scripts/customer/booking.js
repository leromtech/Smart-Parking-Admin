import { ref } from "vue"
import api from "../../boot/api"
import useAuth from "../auth"

const booking = ref([])

const getBooking = async (userId) => {
    try {
        const {data} = await api.get('bookings', {filters: {user_id: userId}})
        booking.value = data.data // Assuming data contains the booking information
    } catch (error) {
        console.error('Error fetching booking:', error)
        return null
    }
}

export default function useBooking() {
    const {user} = useAuth()
    
    // If no user, return null immediately
    if (!user) {
        return null
    }

    // Fetch booking and return reactive reference
    getBooking(user.id)
    return {
        booking
    }
}