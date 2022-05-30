import React, { useEffect, useState } from 'react';

import Banner from '../partials/Banner';
import DateChoose from '../partials/actions/DateChoose';
import Header from '../partials/Header';
import InputMod from '../components/InputMod';
import LabelMod from '../components/labelMod';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';


function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [brand, setBrand] = React.useState([]);
    const [product, setProduct] = React.useState([]);
    const [itemHoTen, setItemHoTen] = React.useState('');
    const [itemBrand, setItemBrand] = React.useState(-1);
    const [selectedBrand, setSelectedBrand] = React.useState(-1);
    const [selectedProduct, setSelectedProduct] = React.useState(-1);

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieu();
        setBrand(res);
    }

    const onImageBrand = async (value) => {
        let res = await SanPhamHook.getSanPhamByThuongHieu(value);
        setSelectedBrand(value);
        setProduct(res);
    }

    const fetchData = () => {
        getThuongHieu();
    }

    useEffect(() => {
        fetchData();
    }, [])

    const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => setShowModal(false)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={() => setShowModal(false)} autoFocus />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">

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
                                <DateChoose />
                                {/* Add view button */}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => setShowModal(true)}>
                                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Đặt ngay đi bạn eiii</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </main>

                <Banner />

            </div>

            <Dialog header="Đơn Hàng" visible={showModal} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowModal(false)}>
                <div className="card">
                    <div>
                        <LabelMod name={'Họ tên'} />
                    </div>
                    <div>
                        <InputText value={itemHoTen} onChange={(e) => setValue(e.target.value)} placeholder="Kẻ hủy diệt size L" className='w-full' />
                    </div>
                    <div className='mt-2'>
                        <LabelMod name={'Thương hiệu'} />
                    </div>
                    <div>
                        <div class="flex flex-row">
                            {
                                brand.map((item, key) => {
                                    return (
                                        <div
                                            className={(key + 1) !== brand.length ? 'mr-2' : ''}
                                            style={{
                                                borderWidth: selectedBrand === item.value ? 3 : 0,
                                                borderStyle: selectedBrand === item.value ? 'solid' : 'none',
                                                borderColor: selectedBrand === item.value ? '#f1749e' : 0
                                            }}
                                            onClick={() => onImageBrand(item.value)}>
                                            <Image key={key}
                                                imageStyle={{ width: 100, height: 100 }}
                                                src={`data:${item.Mime};base64,${item.Logo}`}
                                                alt={item.label}
                                            />
                                            <div className='bg-green-500'>
                                                <div className='text-white text-center'>{item.label}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='mt-2'>
                        <LabelMod name={'Sản phẩm'} />
                    </div>
                </div>
                <div>
                    <div class="flex flex-row">
                        {
                            product.map((item, key) => {
                                return (
                                    <div className='mr-2'
                                        style={{
                                            borderWidth: selectedProduct === item.value ? 3 : 0,
                                            borderStyle: selectedProduct === item.value ? 'solid' : 'none',
                                            borderColor: selectedProduct === item.value ? '#f1749e' : 0
                                        }}>
                                        <div style={{ borderWidth: 1, borderStyle: 'solid' }} className='border-indigo-50 p-5'>
                                            <Image key={key}
                                                imageStyle={{ width: 100, height: 100 }}
                                                src={`data:${item.mime};base64,${item.content}`}
                                                className={'align-items-center justify-content-center'}
                                                alt={item.label}
                                            />

                                        </div>
                                        <div className='bg-indigo-500'>
                                            <div className='text-white text-center'>{item.label}</div>
                                            <div className='text-white text-center font-bold'>{item.donGia.toLocaleString('en')}</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default Home;