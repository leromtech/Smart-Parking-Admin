import { ref } from "vue";
import api from "../boot/api";
import axios from "axios";
import router from "../routes/router";
import { data } from "autoprefixer";

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

const fetchUser = async () => {
    if (!user.value) {
        try {
            const { data } = await api.get('user')
            user.value = data
            roles.value = user.value.roles.map((item) => item.name)
            if (data.parkingZoneOwned) { // Changed from parking_zone_owned to parkingZoneOwned
                parkingZoneId.value = data.parkingZoneOwned.id
            } else if (data.parkingZoneManaged) { // Changed from parking_zone_managed to parkingZoneManaged
                parkingZoneId.value = data.parkingZoneManaged.id
            }
        } catch (e) {
            localStorage.removeItem('authToken')
        }
    }
}

const login = async (formData, callback = null) => { // Changed fd to formData, cb to callback
    loading.value = true
    const { data } = await api.post('admin-login', formData);
    loading.value = false
    if (data.success) {
        localStorage.setItem('authToken', data.token)
        user.value = data.user
        roles.value = user.value.roles.map((item) => item.name)

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
        router.replace('/')
    } else {
        return data.message
    }
}

const register = async (formData, callback = null) => { // Changed fd to formData, cb to callback
    loading.value = true
    const { data } = await api.post('register', formData)
    loading.value = false
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