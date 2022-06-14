import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import Header from '../partials/Header';
import LabelMod from '../components/LabelMod';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

function Topping() {
    const toast = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemBrand, setItemBrand] = useState(-1);
    const [brand, setBrand] = useState([]);

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieuDropDown();
        setBrand(res);
    }
    
    const fetchData = () => {
        getThuongHieu();
    }

    const onChangeTopping = (flag) => {
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
                let info = await SanPhamHook.getSanPhamById(itemProduct);
                let params = {
                    name: itemHoTen,
                    idBrand: itemBrand,
                    brandName: itemBrandName,
                    size: itemSize,
                    sugar: itemSugar.key,
                    ice: itemIce.key,
                    idProduct: itemProduct,
                    productName: itemProductName,
                    price: itemSize ? (info.price + info.priceForUpSize) : info.price,
                    createdDate: moment(new Date()).format('DD/MM/YYYY')
                }

                if (!flag) // add
                    DanhSachHook.addDanhSach(params);
                else // edit
                    DanhSachHook.updateDanhSach(itemDanhSach, params);
            }

            if (mess !== '') {
                Constants.showWarn(toast, mess);
            }
            else {
                getDanhSach();
                setShowModal(false);
                Constants.showSuccess(toast, 'Đã nhận được đơn hàng');
            }
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const renderFooter = (
        <div>
            <Button label="Xác nhận" icon="pi pi-check" onClick={() => onChangeTopping(false)} />
            <Button label="Hủy" icon="pi pi-times" onClick={() => setShowModal(false)} />
        </div>
    );

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
                            <Button icon='pi pi-plus' iconPos='left' label='Thêm Topping' onClick={() => setShowModal(true)} />
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
                    <Dropdown value={itemBrand} options={brand} onChange={(e) => setItemBrand(e.value)} placeholder="Chọn thương hiệu" className='w-full' />
                </div>
            </Dialog>
        </div>
    );
}

export default Topping;