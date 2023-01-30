import React, { useEffect, useRef, useState } from 'react';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import Header from '../partials/Header';
import LabelMod from '../components/LabelMod';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';

function ThuongHieu() {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [flag, setFlag] = useState(false); // false: add item - true: edit item
    const [itemName, setItemName] = useState('');
    const [itemMime, setItemMime] = useState('');
    const [itemLogo, setItemLogo] = useState('');
    const [itemBrand, setItemBrand] = useState(-1);
    const [itemPrice, setItemPrice] = useState(0);
    const [brand, setBrand] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue('');
    }

    const getThuongHieu = async () => {
        setIsLoading(true);
        let res = await ThuongHieuHook.getThuongHieu();
        setBrand(res);
        setIsLoading(false);
    }

    const onChangeModal = () => {
        setShowModal(true);
        setFlag(false);
        setItemName('');
        setItemMime('');
        setItemLogo('');
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
        setItemBrand(item.id);
        setItemName(item.label);
        setItemMime(item.Mime);
        setItemLogo(item.Logo);
    }

    const onDeleteRow = async (item) => {
        try {
            await ThuongHieuHook.deleteBrand(item.id);
            Constants.showSuccess(toast, 'Đã xóa dữ liệu');
            getThuongHieu();
        } catch (error) {
            alert(error)
        }
    }

    const fetchData = () => {
        getThuongHieu();
    }

    const onChangeBrand = async () => {
        try {
            let mess = '';
            let countError = 0;

            if (itemName === '') {
                mess += 'Bạn chưa nhập tên thương hiệu' + '\n';
                countError++;
            }

            if (itemMime === '') {
                mess += 'Bạn chưa nhập Mime' + '\n';
                countError++;
            }

            if (itemLogo === '') {
                mess += 'Bạn chưa nhập Logo' + '\n';
                countError++;
            }

            if (countError === 0) {
                let params = {
                    label: itemName,
                    Mime: itemMime,
                    Logo: itemLogo,
                    HienThi: true
                }

                if (!flag) // add
                    await ThuongHieuHook.addBrand(params);
                else // edit
                    await ThuongHieuHook.updateBrand(itemBrand, params);
            }

            if (mess !== '') {
                Constants.showWarn(toast, mess);
            }
            else {
                getThuongHieu();
                setShowModal(false);
                Constants.showSuccess(toast, 'Đã thêm thương hiệu');
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
            <Button label="Xác nhận" icon="pi pi-check" onClick={() => onChangeBrand()} />
        </div>
    );

    const bodyLogo = (value) => {
        return (
            <Image
                imageStyle={{ width: 100, height: 100 }}
                src={`data:${value.Mime};base64,${value.Logo}`}
                alt={value.label}
            />
        )
    }

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
                            <Button icon='pi pi-plus' iconPos='left' label='Thêm Thương hiệu' onClick={() => onChangeModal()} />
                        </div>

                        <div className='mt-2'>
                            {
                                isLoading &&
                                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                            }
                            {
                                !isLoading &&
                                <DataTable value={brand}
                                    editMode="row"
                                    selectionMode='single'
                                    header={header}
                                    filters={filters}
                                    globalFilterFields={['label']}
                                    // dính lỗi ko thể mở menu khi ở chế độ mobile responsive
                                    // paginator
                                    // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                    // currentPageReportTemplate="Hiển thị từ {first} đến {last} trong {totalRecords} kết quả"
                                    // rows={10}
                                    // rowsPerPageOptions={[10, 20, 50]}
                                    responsiveLayout="scroll">
                                    <Column field="value" header="ID"></Column>
                                    <Column field="label" header="Thương hiệu"></Column>
                                    <Column field="Mime" header="Đơn giá"></Column>
                                    <Column field="Logo" header="Logo" body={bodyLogo}></Column>
                                    <Column field="id" header="id" hidden></Column>
                                    <Column body={bodyEdit}></Column>
                                    <Column body={bodyDelete}></Column>
                                </DataTable>
                            }
                        </div>
                    </div>
                </main>

                <Banner />

            </div>

            <Dialog header="Thương hiệu" visible={showModal} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowModal(false)}>
                <div>
                    <LabelMod name={'Tên thương hiệu'} />
                </div>
                <div>
                    <InputText value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Tên thương hiệu" className='w-full' />
                </div>
                <div className='mt-2'>
                    <LabelMod name={'Mime'} />
                </div>
                <div>
                    <InputText value={itemMime} onChange={(e) => setItemMime(e.target.value)} placeholder="Mime" className='w-full' />
                </div>
                <div className='mt-2'>
                    <LabelMod name={'Logo'} />
                </div>
                <div>
                    <InputText value={itemLogo} onChange={(e) => setItemLogo(e.target.value)} placeholder="Logo" className='w-full' />
                </div>
            </Dialog>
        </div>
    );
}

export default ThuongHieu;