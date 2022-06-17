import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import DanhSachHook from '../class/hooks/useDanhSach';
import DateChoose from '../partials/actions/DateChoose';
import DonHangHook from '../class/hooks/useDonHang';
import Header from '../partials/Header';
import LabelMod from '../components/LabelMod';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "./styles.css"

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import { Row } from 'primereact/row';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';

function Home() {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [flag, setFlag] = useState(false); // flag: add - true: edit
    const [disabledModal, setDisabledModal] = useState(false);
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

    const getGiamGia = async (value) => {
        let date = typeof value !== 'undefined' && value !== null ? value : itemDate;
        let res = await DonHangHook.getGiamGiaByNgayDat(date);

        if (res.length === 0)
            setItemReduce(null)
        else
            setItemReduce(res[0].giamGia)
    }

    const getDanhSach = async (value) => {
        setIsLoading(true);
        let res = await DanhSachHook.getDanhSach(typeof value !== 'undefined' ? value : itemDate);
        setData(res);
        setIsLoading(false);
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

    const onChangeReduce = (value) => {
        if (data.length > 0) {
            let params = {
                ngayDat: moment(itemDate).format('DD/MM/YYYY'),
                giamGia: value
            }
            DonHangHook.updateGiamGiaByNgayDat(itemDate, params);
            setItemReduce(value);
        }
        else {
            Constants.showWarn(toast, 'Bạn không có dữ liệu vì vậy giảm giá không có hiệu lực')
        }
    }

    const onChangeDisabledModal = (value) => {
        if (value > new Date())
            setDisabledModal(true);
        else
            setDisabledModal(false)
    }

    const onDecreaseDate = () => {
        let res = moment(itemDate).subtract(1, 'day').toDate();
        onChangeDisabledModal(res);
        setShowModal(false);
        setItemDate(res);
        getGiamGia(res);
        getDanhSach(res);
    }

    const onIncreaseDate = () => {
        let res = moment(itemDate).add(1, 'day').toDate();
        onChangeDisabledModal(res);
        setShowModal(false);
        setItemDate(res);
        getGiamGia(res);
        getDanhSach(res);
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
        getGiamGia();
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

            if (itemSugar === -1) {
                mess += 'Bạn chưa chọn tỷ lệ đường' + '\n';
                countError++;
            }

            if (itemIce === -1) {
                mess += 'Bạn chưa chọn tỷ lệ đá' + '\n';
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
                    await DanhSachHook.addDanhSach(params);
                else // edit
                    await DanhSachHook.updateDanhSach(itemDanhSach, params);
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

                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                <div className="flex justify-start">
                                    <Button icon="pi pi-angle-left" className='p-button-text p-button-plain' onClick={() => onDecreaseDate()} />
                                    {/* <Calendar id="icon" value={itemDate} onChange={(e) => handleDate(e.value)} showIcon dateFormat='dd/mm/yy' /> */}
                                    <DateChoose value={itemDate} onChange={(e) => handleDate(e)} />
                                    <Button icon="pi pi-angle-right" className='p-button-text p-button-plain' onClick={() => onIncreaseDate()} />
                                </div>
                                <div className="flex justify-start">
                                    <Button label={!disabledModal ? 'Đặt ngay đi bạn eiii' : 'Quay xe đi bạn eiii'}
                                        disabled={disabledModal}
                                        style={{ backgroundColor: 'deeppink', borderColor: 'deeppink' }}
                                        icon='pi pi-plus'
                                        iconPos='left'
                                        onClick={() => onChangeModal()} />
                                </div>
                                <div className="flex justify-start">
                                    <InputNumber value={itemReduce}
                                        onValueChange={(e) => onChangeReduce(e.value)}
                                        placeholder='Giảm giá %'
                                        suffix='%'
                                        min={1}
                                        max={100} />
                                </div>
                            </div>
                        </div>

                        {
                            showModal &&
                            <div className="card mt-2">
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
                                                    <label style={{ color: 'deeppink' }}>{product.length}</label>
                                                </div>
                                                <div className="flex" style={{ height: 500, overflowY: 'scroll' }}>
                                                    <div className='flex-row'>
                                                        {
                                                            product.map((item, key) => {
                                                                return (
                                                                    <div
                                                                        key={key}
                                                                        className={(key + 1) !== product.length ? 'mr-2' : ''}
                                                                        style={{ width: 120, height: 270, float: 'left' }}
                                                                        onClick={() => onChangeProduct(item)}>
                                                                        <div style={{ borderWidth: 1, borderStyle: 'solid' }} className='border-indigo-50 p-5'>
                                                                            <Image
                                                                                imageStyle={{ width: 120, height: 80 }}
                                                                                src={item.content === '' ? item.path : item.content}
                                                                                alt={item.label}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: 140, background: itemProduct === item.id ? '#90cd93' : '#4baaf5' }}>
                                                                            <div style={{ height: 110 }} className='text-white text-center p-2 tooltip-on-hover'>{item.label}</div>
                                                                            <div class="tooltip" style={{
                                                                                backgroundColor: '#ff1493',
                                                                                color: '#fff',
                                                                                position: 'relative',
                                                                                borderRadius: 5,
                                                                                padding: 5
                                                                            }}>{item.description !== '' ? item.description : 'Không có mô tả'}</div>
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
                            {
                                isLoading &&
                                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                            }
                            {
                                !isLoading &&
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
                            }
                        </div>
                    </div>
                </main>

                <Banner />

            </div>
        </div>
    );
}

export default Home;