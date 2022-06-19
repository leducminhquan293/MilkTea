import React, { useEffect, useRef, useState } from 'react';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import Header from '../partials/Header';
import LabelMod from '../components/LabelMod';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import ToppingHook from '../class/hooks/useTopping';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';

function Topping() {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [flag, setFlag] = useState(false); // false: add item - true: edit item
    const [itemName, setItemName] = useState('');
    const [itemTopping, setItemTopping] = useState(-1);
    const [itemBrand, setItemBrand] = useState(-1);
    const [itemPrice, setItemPrice] = useState(0);
    const [brand, setBrand] = useState([]);
    const [topping, setTopping] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('');
    }

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieuDropDown();
        setBrand(res);
    }

    const getTopping = async () => {
        setIsLoading(true);
        let res = await ToppingHook.getTopping();
        setTopping(res);
        setIsLoading(false);
    }

    const onChangeModal = () => {
        setShowModal(true);
        setFlag(false);
        setItemName('');
    }

    const onChangeBrand = async (e) => {
        setItemBrand(e.value);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const onEditRow = async (item) => {
        setShowModal(true);
        setFlag(true);
        setItemTopping(item.id);
        setItemName(item.label);
        setItemBrand(item.idBrand);
        setItemPrice(item.price);
    }

    const onDeleteRow = async (item) => {
        try {
            await ToppingHook.deleteTopping(item.id);
            Constants.showSuccess(toast, 'Đã xóa dữ liệu');
            getTopping();
        } catch (error) {
            alert(error)
        }
    }

    const fetchData = () => {
        getThuongHieu();
        getTopping();
    }

    const onChangeTopping = async () => {
        try {
            let mess = '';
            let countError = 0;

            if (itemName === '') {
                mess += 'Bạn chưa nhập tên topping' + '\n';
                countError++;
            }

            if (itemBrand === -1) {
                mess += 'Bạn chưa chọn thương hiệu' + '\n';
                countError++;
            }

            if (countError === 0) {
                let res = await ThuongHieuHook.getThuongHieuByValue(itemBrand);

                let params = {
                    label: itemName,
                    idBrand: itemBrand,
                    brandName: res[0].label,
                    price: itemPrice,
                    hienThi: true
                }

                if (!flag) // add
                    await ToppingHook.addTopping(params);
                else // edit
                    await ToppingHook.updateTopping(itemTopping, params);
            }

            if (mess !== '') {
                Constants.showWarn(toast, mess);
            }
            else {
                getTopping();
                setShowModal(false);
                Constants.showSuccess(toast, 'Đã thêm topping');
            }
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        fetchData();
        initFilters();
    }, [])

    const renderFooter = (
        <div>
            <Button label="Hủy" icon="pi pi-times" className='p-button-secondary' onClick={() => setShowModal(false)} />
            <Button label="Xác nhận" icon="pi pi-check" onClick={() => onChangeTopping()} />
        </div>
    );

    const bodyEdit = (value) => {
        return (
            <Button icon="pi pi-pencil" iconPos="right" onClick={() => onEditRow(value)} />
        )
    }

    const bodyDelete = (value) => {
        return (
            <Button icon="pi pi-trash" iconPos="right" onClick={() => onDeleteRow(value)} className="p-button-outlined p-button-danger" />
        )
    }

    const header = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
                </span>
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Toast ref={toast} />

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                        {/* Welcome banner */}
                        <WelcomeBanner />

                        {/* Dashboard actions */}
                        <div>
                            <Button icon='pi pi-plus' iconPos='left' label='Thêm Topping' onClick={() => onChangeModal()} />
                        </div>

                        <div className='mt-2'>
                            {
                                isLoading &&
                                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                            }
                            {
                                !isLoading &&
                                <DataTable value={topping}
                                    editMode="row"
                                    selectionMode='single'
                                    header={header}
                                    filters={filters}
                                    globalFilterFields={['label', 'brandName']}
                                    paginator
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    currentPageReportTemplate="Hiển thị từ {first} đến {last} trong {totalRecords} kết quả"
                                    rows={10}
                                    rowsPerPageOptions={[10, 20, 50]}
                                    responsiveLayout="scroll">
                                    <Column field="label" header="Họ tên"></Column>
                                    <Column field="brandName" header="Thương hiệu"></Column>
                                    <Column field="price" header="Đơn giá"></Column>
                                    <Column field="id" header="id" hidden></Column>
                                    <Column field="value" header="value" hidden></Column>
                                    <Column field="idBrand" header="idBrand" hidden></Column>
                                    <Column body={bodyEdit}></Column>
                                    <Column body={bodyDelete}></Column>
                                </DataTable>
                            }
                        </div>
                    </div>
                </main>

                <Banner />

            </div>

            <Dialog header="Topping" visible={showModal} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowModal(false)}>
                <div>
                    <LabelMod name={'Tên'} />
                </div>
                <div>
                    <InputText value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Tên Topping" className='w-full' />
                </div>
                <div className='mt-2'>
                    <LabelMod name={'Thương hiệu'} />
                </div>
                <div>
                    <Dropdown value={itemBrand} options={brand} onChange={(e) => onChangeBrand(e)} placeholder="Chọn thương hiệu" className='w-full' />
                </div>
                <div className='mt-2'>
                    <LabelMod name={'Đơn giá'} />
                </div>
                <div>
                    <InputNumber value={itemPrice} onChange={(e) => setItemPrice(e.value)} placeholder="Đơn giá" className='w-full' />
                </div>
            </Dialog>
        </div>
    );
}

export default Topping;