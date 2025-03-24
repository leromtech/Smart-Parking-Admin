import { ref } from "vue";

const loginDialogOpen1 = ref(false);
const registerDialogOpen = ref(false);

export default function useLoginDialog() {
    return {
        loginDialogOpen1,
        registerDialogOpen
    }
}