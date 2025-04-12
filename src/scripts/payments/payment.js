import api from "../../boot/api";

const createPayment = async (paymentData) => {
    const formData = new FormData();
    formData.appemd('user_id', paymentData.userId);
    formData.append('amount', paymentData.amount);
    formData.append('payable_id', paymentData.payableId);
    formData.append('payable_type', paymentData.payableType);
    formData.append('currency', "INR");
    try {
        const response = await api('payments', {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating payment:', error);
    }
}

const updatePayment = async (paymentData) => {
    console.log(paymentData)
    const formData = new FormData();
    formData.append('_method', 'UPDATE');
    try {
        const response = await api('payments', formData);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating payment:', error);
    }
}

export default function usePayment() {
    return {
        createPayment,
        updatePayment,
    }
}