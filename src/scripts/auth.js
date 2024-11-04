import { ref } from "vue";
import api from "../boot/api";
import axios from "axios";
import router from "../routes/router";
import { data } from "autoprefixer";

const user = ref(null)
const roles = ref(null)
const parking_zone_id = ref(null)

const loggedIn = () => {
    const token = localStorage.getItem('auth_token')
    if(!token){
        return false
    }
    return true
}

const fetchUser = async () => {
    if(!user.value){
        try{
            const {data} = await api.get('user')
            user.value = data
            roles.value = user.value.roles.map((item) => item.name)
            if(data.parking_zone_owned){
                parking_zone_id.value = data.parking_zone_owned.id
            }else if(data.parking_zone_managed){
                parking_zone_id.value = data.parking_zone_managed.id
            }
        }catch(e){
            localStorage.removeItem('auth_token')
        }
    }
}

const login = async (fd) => {
    await api.get('sanctum/csrf-cookie')
    const {data} = await api.post('login', fd);
    if(data.success){
        localStorage.setItem('auth_token', data.token)
        user.value = data.user
        roles.value = user.value.roles.map((item) => item.name)
        const route = data.user.roles[0] == 'customer' ? '/app' : '/auth'
        router.replace(route)
    }else{
        return data.message
    }
}

const logout = async () => {
    const {data} = await api.post('logout')
    if(data.success){
        localStorage.removeItem('auth_token')
        user.value = null
        roles.value = null
        router.replace('/')
    }else{
        return data.message
    }
}


export default function useAuth(){
    return{
        user,
        roles,
        parking_zone_id,
        login,
        logout,
        loggedIn,
        fetchUser
    }
}