import React, { useEffect, useState } from 'react';

import Banner from '../partials/Banner';
import DateChoose from '../partials/actions/DateChoose';
import Header from '../partials/Header';
import Sidebar from '../partials/Sidebar';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import LabelMod from '../components/labelMod';
import InputMod from '../components/InputMod';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import ThuongHieuHook from '../class/hooks/useThuongHieu';

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [brand, setBrand] = React.useState([]);
    const [itemHoTen, setItemHoTen] = React.useState('');
    const [itemBrand, setItemBrand] = React.useState(-1);

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieu();
        setBrand(res);
    }

    const fetchData = () => {
        getThuongHieu();
    }

    useEffect(() => {
        fetchData();
    }, [])

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

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Đơn hàng
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className='p-fluid'>
                                        <div>
                                            <LabelMod name={'Họ tên'} />
                                        </div>
                                        <div>
                                            <InputText value={itemHoTen} onChange={(e) => setValue(e.target.value)} placeholder="Kẻ hủy diệt size L" className='block' />
                                        </div>
                                        <div className='mt-2'>
                                            <LabelMod name={'Thương hiệu'} />
                                        </div>
                                        <div>
                                            <div class="flex flex-row">
                                                {
                                                    brand.map((item, key) => {
                                                        return (
                                                            <div className={key !== 1 && key !== brand.length ? 'mr-2' : ''}>
                                                                <Image key={key} imageStyle={{ width: 100, height: 100 }} src={`data:${item.Mime};base64,${item.Logo}`} alt={item.label} />
                                                                <div className='text-pink-500 text-center'>{item.label}</div> 
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className='mt-2'>
                                            <LabelMod name={'Sản phẩm'} />
                                            <InputMod placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    );
}

export default Home;