import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import DanhSachHook from '../class/hooks/useDanhSach';
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
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Row } from 'primereact/row';
import { Toast } from 'primereact/toast';

function Home() {
    const toast = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [flag, setFlag] = useState(false); // flag: add - true: edit
    const [brand, setBrand] = useState([]);
    const [product, setProduct] = useState([]);
    const [data, setData] = useState([]);
    const [sugar, setSugar] = useState(Constants.percent);
    const [ice, setIce] = useState(Constants.percent);
    const [itemHoTen, setItemHoTen] = useState('');
    const [itemBrand, setItemBrand] = useState(-1);
    const [itemBrandName, setItemBrandName] = useState('');
    const [itemSize, setItemSize] = useState(false); // false: Medium - true: Large
    const [itemProduct, setItemProduct] = useState(-1);
    const [itemProductName, setItemProductName] = useState('');
    const [itemDate, setItemDate] = useState(new Date());
    const [itemDanhSach, setItemDanhSach] = useState('');
    const [itemSugar, setItemSugar] = useState(-1);
    const [itemIce, setItemIce] = useState(-1);
    const [itemReduce, setItemReduce] = useState();

    const handleDate = (value) => {
        setItemDate(value);
        setShowModal(false);
        getDanhSach(value);
    }

    const getThuongHieu = async () => {
        let res = await ThuongHieuHook.getThuongHieu();
        setBrand(res);
    }

    const getDanhSach = async (value) => {
        let res = await DanhSachHook.getDanhSach(typeof value !== 'undefined' ? value : itemDate);
        setData(res);
    }

    const onChangeModal = () => {
        setShowModal(!showModal);
        setFlag(false);
        setItemHoTen('');
        setItemBrand(-1);
        setItemSize(false);
        setItemProduct(-1);
    }

    const onChangeBrand = async (item) => {
        let res = await SanPhamHook.getSanPhamByThuongHieu(item.value);
        setItemBrand(item.value);
        setItemBrandName(item.label);
        setItemProduct(-1);
        setProduct(res);
    }

    const onChangeSize = (value) => {
        setItemSize(value);
    }

    const onChangeProduct = async (item) => {
        setItemProduct(item.id);
        setItemProductName(item.label);
    }

    const onEditRow = async (item) => {
        setShowModal(true);
        setFlag(true);
        setItemHoTen(item.name);
        setItemBrand(item.idBrand);
        setItemBrandName(item.brandName);
        setItemProductName(item.productName);
        setItemSize(item.size);
        setItemSugar(Constants.percent.find(c => c.key === item.sugar));
        setItemIce(Constants.percent.find(c => c.key === item.ice));
        setItemDanhSach(item.id);
        let res = await SanPhamHook.getSanPhamByThuongHieu(item.idBrand);
        setProduct(res);
        setItemProduct(item.idProduct);
    }

    const onDeleteRow = async (item) => {
        try {
            await DanhSachHook.deleteDanhSachById(item.id);
            Constants.showSuccess(toast, 'Đã xóa dữ liệu');
            getDanhSach();
        } catch (error) {
            alert(error)
        }
    }

    const onCopyRow = async (item) => {
        try {
            let params = {
                name: item.name,
                idBrand: item.idBrand,
                brandName: item.brandName,
                size: item.size,
                sugar: item.sugar,
                ice: item.ice,
                idProduct: item.idProduct,
                productName: item.productName,
                price: item.price,
                createdDate: moment(new Date()).format('DD/MM/YYYY')
            }

            DanhSachHook.addDanhSach(params);
            Constants.showSuccess(toast, 'Đã nhân đôi dữ liệu');
            getDanhSach();
        } catch (error) {
            alert(error)
        }
    }

    const productTotal = () => {
        let total = 0;

        for (let item of data) {
            total++;
        }

        return total.toLocaleString();
    }

    const priceTotal = () => {
        let total = 0;

        for (let item of data) {
            let res = item.price;

            if (typeof itemReduce !== 'undefined' && itemReduce !== null)
                res = item.price - ((item.price * itemReduce) / 100);

            total += res;
        }

        return total.toLocaleString();
    }

    const fetchData = () => {
        getThuongHieu();
        getDanhSach();
    }

    const onConfirm = async () => {
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

    const bodyDonGia = (value) => {
        let res = value.price;

        if (typeof itemReduce !== 'undefined' && itemReduce !== null)
            res = value.price - ((value.price * itemReduce) / 100);

        return res.toLocaleString();
    }

    const bodySize = (value) => {
        return value.size ? 'Large' : 'Medium';
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

    const bodyCopy = (value) => {
        return (
            <Button icon="pi pi-copy" iconPos="right" onClick={() => onCopyRow(value)} className="p-button-info" />
        )
    }

    let footerGroup = <ColumnGroup>
        <Row>
            <Column footer="Tổng cộng:" />
            <Column footer={productTotal} />
            <Column colSpan={3} />
            <Column footer={priceTotal} />
            <Column colSpan={4} />
        </Row>
    </ColumnGroup>;

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
                                <Calendar id="icon" value={itemDate} onChange={(e) => handleDate(e.value)} showIcon dateFormat='dd/mm/yy' />

                                {/* Add view button */}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => onChangeModal()}>
                                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Đặt ngay đi bạn eiii</span>
                                </button>
                                <InputNumber value={itemReduce}
                                    onValueChange={(e) => setItemReduce(e.value)}
                                    placeholder='Giảm giá %'
                                    suffix='%'
                                    min={1}
                                    max={100} />
                            </div>

                        </div>
                        {
                            showModal &&
                            <div className="card">
                                <Card title="Order">
                                    <div className="flex flex-wrap overflow-hidden">
                                        <div className={"w-full overflow-hidden sm:w-" + (itemBrand === -1 ? 'full' : '1/2') + ' ' + (itemBrand === -1 ? 'pr-5' : '')}>
                                            <div>
                                                <LabelMod name={'Họ tên'} />
                                            </div>
                                            <div>
                                                <InputText value={itemHoTen} onChange={(e) => setItemHoTen(e.target.value)} placeholder="Kẻ hủy diệt size L" className='w-full' />
                                            </div>
                                            <div className='mt-2'>
                                                <LabelMod name={'Thương hiệu'} />
                                            </div>
                                            <div className='flex'>
                                                <div className='flex-row'>
                                                    {
                                                        brand.map((item, key) => {
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    style={{ width: 100, float: 'left' }}
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
                                                        <LabelMod name={'Tỷ lệ đường'} />
                                                    </div>
                                                    <div className='flex justify-content-center'>
                                                        {
                                                            sugar.map((category) => {
                                                                return (
                                                                    <div key={category.key} className="field-radiobutton">
                                                                        <RadioButton inputId={category.key}
                                                                            name="sugar" value={category}
                                                                            onChange={(e) => setItemSugar(e.value)}
                                                                            checked={itemSugar.key === category.key}
                                                                            className='mr-1' />
                                                                        <label htmlFor={category.key} className='mr-3'>{category.name}</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='mt-2'>
                                                        <LabelMod name={'Tỷ lệ đá'} />
                                                    </div>
                                                    <div className='flex justify-content-center'>
                                                        {
                                                            ice.map((category) => {
                                                                return (
                                                                    <div key={category.key} className="field-radiobutton">
                                                                        <RadioButton inputId={category.key}
                                                                            name="ice" value={category}
                                                                            onChange={(e) => setItemIce(e.value)}
                                                                            checked={itemIce.key === category.key}
                                                                            className='mr-1' />
                                                                        <label htmlFor={category.key} className='mr-3'>{category.name}</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            <div className="flex flex-wrap overflow-hidden mt-5">
                                                <div className="w-full overflow-hidden sm:w-1/2">
                                                    <Button label="Hủy" icon="pi pi-times" onClick={() => setShowModal(false)} className="p-button-outlined w-full" />
                                                </div>
                                                <div className="w-full overflow-hidden sm:w-1/2">
                                                    <Button label="Đồng ý" icon="pi pi-check" onClick={() => onConfirm()} className="w-full" autoFocus />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            itemBrand !== -1 &&
                                            <div className="w-full overflow-hidden sm:w-1/2 pl-5">
                                                <div className='mt-2'>
                                                    <LabelMod name={'Kích cỡ'} />
                                                </div>
                                                <div className='flex justify-content-center'>
                                                    <InputSwitch checked={itemSize} onChange={(e) => onChangeSize(e.value)} />
                                                    <div className='font-bold ml-2 text-indigo-500'>
                                                        {itemSize === false ? 'Medium' : 'Large'}
                                                    </div>
                                                </div>
                                                <div className='mt-2'>
                                                    <LabelMod name={'Sản phẩm'} />
                                                </div>
                                                <div className="flex" style={{ height: 500, overflowY: 'scroll' }}>
                                                    <div className='flex-row'>
                                                        {
                                                            product.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        key={key}
                                                                        className={(key + 1) !== product.length ? 'mr-2' : ''}
                                                                        style={{ width: 120, height: 250, float: 'left' }}
                                                                        onClick={() => onChangeProduct(item)}>
                                                                        <div style={{ borderWidth: 1, borderStyle: 'solid' }} className='border-indigo-50 p-5'>
                                                                            <Image
                                                                                imageStyle={{ width: 120, height: 80 }}
                                                                                src={item.content}
                                                                                alt={item.label}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: 120 }} className={itemProduct === item.id ? 'bg-yellow-500' : 'bg-cyan-500'}>
                                                                            <div style={{ height: 90 }} className='text-white text-center p-2'>{item.label}</div>
                                                                            <div style={{ height: 30 }} className='text-white text-center font-bold'>{itemSize ? (item.price + item.priceForUpSize).toLocaleString() : item.price.toLocaleString()}</div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </Card>
                            </div>
                        }
                        <div className='mt-2'>
                            <DataTable value={data}
                                editMode="row"
                                selectionMode='single'
                                responsiveLayout="scroll"
                                footerColumnGroup={footerGroup}>
                                <Column field="name" header="Họ tên"></Column>
                                <Column field="productName" header="Sản phẩm"></Column>
                                <Column field="size" header="Kích cỡ" body={bodySize}></Column>
                                <Column field="sugar" header="Tỷ lệ đường"></Column>
                                <Column field="ice" header="Tỷ lệ đá"></Column>
                                <Column field="price" header="Đơn giá" body={bodyDonGia}></Column>
                                <Column field="brandName" header="Thương hiệu"></Column>
                                <Column field="id" header="id" hidden></Column>
                                <Column field="idBrand" header="idBrand" hidden></Column>
                                <Column field="idProduct" header="idProduct" hidden></Column>
                                <Column body={bodyEdit}></Column>
                                <Column body={bodyDelete}></Column>
                                <Column body={bodyCopy}></Column>
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