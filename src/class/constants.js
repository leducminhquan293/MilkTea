const COLOR = {
    indigo_500: '#3f51b5'
}

const showSuccess = (toast, mess) => {
    toast.current.show({ severity: 'success', summary: 'Thành công', detail: mess, life: 3000 });
}

const showWarn = (toast, mess) => {
    toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: mess, life: 3000 });
}

const showError = (toast, mess) => {
    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: mess, life: 3000 });
}

const percent = [
    {
        key: 0,
        name: '0%'
    },
    {
        key: 30,
        name: '30%'
    },
    {
        key: 50,
        name: '50%'
    },
    {
        key: 70,
        name: '70%'
    },
    {
        key: 100,
        name: '100%'
    },
]

const Constants = {
    COLOR,
    showSuccess,
    showWarn,
    showError,
    percent
}

export default Constants;