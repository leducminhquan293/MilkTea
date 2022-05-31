import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import Banner from '../partials/Banner';
import DateChoose from '../partials/actions/DateChoose';
import Header from '../partials/Header';
import LabelMod from '../components/labelMod';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import DanhSachHook from '../class/hooks/useDanhSach';

function Home() {
    const toast = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [brand, setBrand] = React.useState([]);
    const [product, setProduct] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [itemHoTen, setItemHoTen] = React.useState('');
    const [itemBrand, setItemBrand] = React.useState(-1);
    const [itemBrandName, setItemBrandName] = React.useState('');
    const [itemSize, setItemSize] = React.useState(false);
    const [itemProduct, setItemProduct] = React.useState(-1);
    const [itemProductName, setItemProductName] = React.useState('');
    const [itemDonGia, setItemDonGia] = React.useState(0);
    const [itemDate, setItemDate] = React.useState(new Date());

    const showSuccess = (mess) => {
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: mess, life: 3000 });
    }

    const showWarn = (mess) => {
        toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: mess, life: 3000 });
    }

    const showError = (mess) => {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: mess, life: 3000 });
    }

    const handleDate = (value) => {
        setItemDate(value);
        setShowModal(false);
        getDanhSach(value[0]);
    }

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieu();
        setBrand(res);
    }

    const getDanhSach = async (value) => {
        let res = await DanhSachHook.getDanhSach(typeof value !== 'undefined' ? value : itemDate);
        setData(res);
    }

    const onChangeBrand = async (item) => {
        let res = await SanPhamHook.getSanPhamByThuongHieu(item.value);
        setItemBrand(item.value);
        setItemBrandName(item.label);
        setProduct(res);
    }

    const onChangeSize = (value) => {
        setItemSize(value);
    }

    const onChangeProduct = async (item) => {
        let donGia = itemSize ? (item.price + item.priceForUpSize) : item.price;
        setItemProduct(item.value);
        setItemProductName(item.label);
        setItemDonGia(donGia);
    }

    const fetchData = () => {
        getThuongHieu();
        getDanhSach();
    }

    const onConfirm = () => {
        try {
            let mess = '';
            let countError = 0;

            if (itemHoTen === '') {
                mess += 'Bạn chưa nhập họ tên' + '\n';
                countError++;
            }

            if (itemBrand === -1) {
                mess += 'Bạn chưa chọn thương hiệu' + '\n';
                countError++;
            }
            else {
                if (itemProduct === -1) {
                    mess += 'Bạn chưa chọn sản phẩm' + '\n';
                    countError++;
                }
            }

            if (countError === 0) {
                let params = {
                    name: itemHoTen,
                    idBrand: itemBrand,
                    brandname: itemBrandName,
                    size: itemSize,
                    idProduct: itemProduct,
                    productName: itemProductName,
                    price: itemDonGia,
                    createdDate: moment(new Date()).format('DD/MM/YYYY')
                }

                DanhSachHook.addDanhSach(params);
            }

            if (mess !== '') {
                showWarn(mess);
            }
            else {
                getDanhSach();
                setShowModal(false);
                showSuccess('Đã nhận được đơn hàng')
            }
        } catch (error) {
            showError(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const bodyDonGia = (value) => {
        return value.DonGia.toLocaleString();
    }

    const bodySize = (value) => {
        return value.Size ? 'Large' : 'Medium';
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
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                {/* Datepicker built with flatpickr */}
                                <DateChoose onChange={handleDate} />
                                {/* Add view button */}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => setShowModal(!showModal)}>
                                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Đặt ngay đi bạn eiii</span>
                                </button>
                            </div>

                        </div>
                        {
                            showModal &&
                            <div className="card">
                                <Card title="Order">
                                    <div class="flex flex-wrap overflow-hidden">
                                        <div class={"w-full overflow-hidden sm:w-" + (itemBrand === -1 ? 'full' : '1/2') + ' ' + (itemBrand === -1 ? 'pr-5' : '')}>
                                            <div>
                                                <LabelMod name={'Họ tên'} />
                                            </div>
                                            <div>
                                                <InputText value={itemHoTen} onChange={(e) => setItemHoTen(e.target.value)} placeholder="Kẻ hủy diệt size L" className='w-full' />
                                            </div>
                                            <div className='mt-2'>
                                                <LabelMod name={'Thương hiệu'} />
                                            </div>
                                            <div>
                                                <div className="flex flex-row">
                                                    {
                                                        brand.map((item, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={(key + 1) !== brand.length ? 'mr-2' : ''}
                                                                    onClick={() => onChangeBrand(item)}>
                                                                    <Image
                                                                        imageStyle={{ width: 100, height: 100 }}
                                                                        src={`data:${item.Mime};base64,${item.Logo}`}
                                                                        alt={item.label}
                                                                    />
                                                                    <div className={itemBrand === item.value ? 'bg-indigo-500' : 'bg-cyan-500'}>
                                                                        <div className='text-white text-center'>{item.label}</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {
                                                itemBrand !== -1 &&
                                                <div>
                                                    <div className='mt-2'>
                                                        <LabelMod name={'Kích cỡ'} />
                                                    </div>
                                                    <div className='flex justify-content-center'>
                                                        <InputSwitch checked={itemSize} onChange={(e) => onChangeSize(e.value)} />
                                                        <div className='font-bold ml-2 text-indigo-500'>
                                                            {itemSize === false ? 'Medium' : 'Large'}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <div class="flex flex-wrap overflow-hidden mt-5">
                                                <div class="w-full overflow-hidden sm:w-1/2">
                                                    <Button label="Hủy" icon="pi pi-times" onClick={() => setShowModal(false)} className="p-button-outlined w-full" />
                                                </div>
                                                <div class="w-full overflow-hidden sm:w-1/2">
                                                    <Button label="Đồng ý" icon="pi pi-check" onClick={() => onConfirm()} className="w-full" autoFocus />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            itemBrand !== -1 &&
                                            <div class="w-full overflow-hidden sm:w-1/2 pl-5">
                                                <div>
                                                    <LabelMod name={'Sản phẩm'} />
                                                </div>
                                                <div className="flex flex-row">
                                                    {
                                                        product.map((item, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={(key + 1) !== brand.length ? 'mr-2' : ''}
                                                                    onClick={() => onChangeProduct(item)}>
                                                                    <div style={{ borderWidth: 1, borderStyle: 'solid' }} className='border-indigo-50 p-5'>
                                                                        <Image
                                                                            imageStyle={{ width: 100, height: 100 }}
                                                                            src={`data:${item.mime};base64,${item.content}`}
                                                                            className={'align-items-center justify-content-center'}
                                                                            alt={item.label}
                                                                        />

                                                                    </div>
                                                                    <div className={itemProduct === item.value ? 'bg-yellow-500' : 'bg-cyan-500'}>
                                                                        <div className='text-white text-center'>{item.label}</div>
                                                                        <div className='text-white text-center font-bold'>{itemSize ? (item.donGia + item.priceForUpSize).toLocaleString() : item.donGia.toLocaleString()}</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </Card>
                            </div>
                        }
                        <div className='mt-2'>
                            <DataTable value={data} responsiveLayout="scroll">
                                <Column field="name" header="Họ tên"></Column>
                                <Column field="brandName" header="Thương hiệu"></Column>
                                <Column field="size" header="Kích cỡ" body={bodySize}></Column>
                                <Column field="productName" header="Sản phẩm"></Column>
                                <Column field="price" header="Đơn giá" body={bodyDonGia}></Column>
                            </DataTable>
                        </div>
                    </div>
                </main>

                <Banner />

            </div>
        </div>
    );
}

export default Home;