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

const Constants = {
    COLOR,
    showSuccess,
    showWarn,
    showError
}

export default Constants;