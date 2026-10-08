import { ref } from "vue";
import api from "../boot/api";
import router from "../routes/router";

const user = ref(null)
const roles = ref(null)
const parkingZoneId = ref(null) // Changed from parking_zone_id to parkingZoneId
const loading = ref(false)

const loggedIn = () => {
    const token = localStorage.getItem('authToken') // Changed from auth_token to authToken
    if (!token) {
        return false
    }
    return true
}

// API returns snake_case relations (parking_zone_owned / parking_zone_managed)
const setUser = (data) => {
    user.value = data
    roles.value = data.roles.map((item) => item.name)
    const zone = data.parking_zone_owned ?? data.parking_zone_managed ?? null
    parkingZoneId.value = zone?.id ?? null
}

const fetchUser = async () => {
    if (!user.value) {
        try {
            const { data } = await api.get('user')
            setUser(data)
        } catch (e) {
            localStorage.removeItem('authToken')
        }
    }
}

const login = async (formData, callback = null) => { // Changed fd to formData, cb to callback
    let data
    try {
        loading.value = true
        const response = await api.post('admin-login', formData)
        data = response.data
    } catch (e) {
        const message = e?.response?.data?.message || 'Login failed. Please try again.'
        callback && callback({ success: false, message })
        return message
    } finally {
        loading.value = false
    }
    if (data.success) {
        localStorage.setItem('authToken', data.token)
        setUser(data.user)

        switch (user.value.roles[0].name) {
            case 'customer':
            case 'manager':
                // Redirect to external Flutter web app using window.location
                window.location.href = import.meta.env.VITE_FRONTEND_URL;
                return; // Exit early to prevent further execution
            case 'superadmin':
                router.push('/admin');
                break;
            case 'owner':
                router.push('/parking-zone');
                break;
            default:
                router.push('/');
                break;
        }

        callback && callback(data)
    } else {
        callback && callback(data)
        return data.message
    }
}

const logout = async () => {
    const { data } = await api.post('logout')
    if (data.success) {
        localStorage.removeItem('authToken')
        user.value = null
        roles.value = null
        parkingZoneId.value = null
        router.replace('/')
    } else {
        return data.message
    }
}

const register = async (formData, callback = null) => { // Changed fd to formData, cb to callback
    let data
    try {
        loading.value = true
        const response = await api.post('register', formData)
        data = response.data
    } finally {
        loading.value = false
    }
    callback && callback(data)
    return data
}

export default function useAuth() {
    return {
        user,
        roles,
        parkingZoneId, // Updated export name
        loading,
        login,
        logout,
        loggedIn,
        fetchUser,
        register
    }
}