import { ref } from "vue"

const _message = ref('')
const _type = ref('')

const notify = ({type, message}) => {
    _message.value = message
    _type.value = type
    setTimeout(() => {
        _message.value = ''
        _type.value = ''
    }, 2000)
}

export default function useNotification(){
    return{
        notify,
        _message,
        _type,
    }
}