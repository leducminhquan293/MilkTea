import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import DanhSachHook from '../class/hooks/useDanhSach';
import DateChoose from '../partials/actions/DateChoose';
import DonHangHook from '../class/hooks/useDonHang';
import Header from '../partials/Header';
import LabelMod from '../components/LabelMod';
import QuaySoHook from '../class/hooks/useQuaySo';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import ThuongHieuHook from '../class/hooks/useThuongHieu';
import ToppingHook from '../class/hooks/useTopping';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "./styles.css"

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { ProgressBar } from 'primereact/progressbar';
import { RadioButton } from 'primereact/radiobutton';
import { Row } from 'primereact/row';
import { Toast } from 'primereact/toast';

const minConst = 1;
const maxConst = 45;

function Home() {
    const toast = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalRandom, setShowModalRandom] = useState(false);
    const [showModalSetting, setShowModalSetting] = useState(false);
    const [flag, setFlag] = useState(false); // flag: add - true: edit
    const [fire, setFire] = useState(false);
    const [disabledModal, setDisabledModal] = useState(false);
    const [priceTopping, setPriceTopping] = useState([]);
    const [checkTopping, setCheckTopping] = useState([]);
    const [topping, setTopping] = useState([]);
    const [brand, setBrand] = useState([]);
    const [product, setProduct] = useState([]);
    const [data, setData] = useState([]);
    const [sugar, setSugar] = useState(Constants.percent);
    const [ice, setIce] = useState(Constants.percent);
    const [itemHoTen, setItemHoTen] = useState('');
    const [itemBrand, setItemBrand] = useState(-1);
    const [itemBrandName, setItemBrandName] = useState('');
    const [itemSize, setItemSize] = useState(false); // false: Medium - true: Large
    const [itemSizeSetting, setItemSizeSetting] = useState(false); // false: Medium - true: Large
    const [selectedProduct, setSelectedProduct] = useState(-1);
    const [itemProduct, setItemProduct] = useState(-1);
    const [itemProductName, setItemProductName] = useState('');
    const [itemDate, setItemDate] = useState(new Date());
    const [itemDanhSach, setItemDanhSach] = useState('');
    const [itemSugar, setItemSugar] = useState({ key: 30, name: '30%' });
    const [itemIce, setItemIce] = useState({ key: 100, name: '100%' });
    const [itemSugarSetting, setItemSugarSetting] = useState({ key: 30, name: '30%' });
    const [itemIceSetting, setItemIceSetting] = useState({ key: 100, name: '100%' });
    const [itemReduce, setItemReduce] = useState();
    const [itemNumberInit, setItemNumberInit] = useState(1);
    const [itemRes1, setItemRes1] = useState();
    const [itemRes2, setItemRes2] = useState();
    const [itemRes3, setItemRes3] = useState();
    const [itemRes4, setItemRes4] = useState();
    const [itemPre1, setItemPre1] = useState();
    const [itemPre2, setItemPre2] = useState();
    const [itemPre3, setItemPre3] = useState();
    const [itemPre4, setItemPre4] = useState();
    const [itemOfficial, setItemOfficial] = useState('');
    const [valueProgress, setValueProgress] = useState(0);
    const interval = useRef(null);

    const randomNumer = () => {
        const min = minConst;
        const max = maxConst;
        const rand = min + Math.random() * (max - min);

        return rand;
    }

    const randomNumerBrand = () => {
        const min = minConst;
        const max = 6;
        const rand = min + Math.random() * (max - min);

        return rand;
    }

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

    const onChangeModalRandom = () => {
        setShowModalRandom(!showModalRandom);
    }

    const onChangeModalSetting = () => {
        setShowModalSetting(!showModalSetting);
    }

    const onChangeCheckTopping = (e, item) => {
        if (itemProduct !== -1) {
            let selectedTopping = [...checkTopping];
            let selectedPriceTopping = [...priceTopping];

            if (e.checked) {
                selectedTopping.push(e.value);
                selectedPriceTopping.push(item);
            }
            else {
                selectedTopping.splice(selectedTopping.indexOf(e.value), 1);
                selectedPriceTopping = selectedPriceTopping.filter(c => c.value !== e.value);
            }

            setPriceTopping(selectedPriceTopping);
            setCheckTopping(selectedTopping);
        }
        else {
            Constants.showWarn(toast, 'Bạn chưa chọn đồ uống');
        }
    }

    const onChangeQuaySo = () => {
        setFire(true);
        setValueProgress(0);
    }

    const onChangeSetting = () => {
        localStorage.setItem('sugar', JSON.stringify(itemSugarSetting));
        localStorage.setItem('ice', JSON.stringify(itemIceSetting));
        localStorage.setItem('size', JSON.stringify(itemSizeSetting));
        setShowModalSetting(false);
        Constants.showSuccess(toast, 'Cài đặt thành công');
    }

    const onChangeBrand = async (item) => {
        setIsLoadingProduct(true);
        let res = await SanPhamHook.getSanPhamByThuongHieu(item.value);
        let resTopping = await ToppingHook.getToppingByThuongHieu(item.value);
        setItemBrand(item.value);
        setItemBrandName(item.label);
        setItemProduct(-1);
        setProduct(res);
        setTopping(resTopping);
        setCheckTopping([]);
        setPriceTopping([]);
        let lsSugar = localStorage.getItem('sugar');
        let lsIce = localStorage.getItem('ice');
        let lsSize = localStorage.getItem('size') === 'false' ? false : true;

        if (lsSugar)
            setItemSugar(JSON.parse(lsSugar));

        if (lsIce)
            setItemIce(JSON.parse(lsIce));

        if (lsSize)
            setItemSize(lsSize);

        setIsLoadingProduct(false);
    }

    const onChangeProduct = async (item) => {
        setSelectedProduct(item);
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
        let resTopping = await ToppingHook.getToppingByThuongHieu(item.idBrand);
        setTopping(resTopping);
        setCheckTopping(item.valueTopping);
        setPriceTopping(item.toppingName);
        setItemDanhSach(item.id);
        let res = await SanPhamHook.getSanPhamByThuongHieu(item.idBrand);
        let resProduct = await SanPhamHook.getSanPhamById(item.idProduct);
        setProduct(res);
        setSelectedProduct(resProduct);
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
                valueTopping: item.valueTopping,
                toppingName: item.toppingName,
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

    const renderPrice = (item) => {
        let total = 0;
        let topping = 0;

        for (let value of priceTopping) {
            topping += value.price;
        }

        total += itemSize ? (item.price + item.priceForUpSize) : item.price;

        if (item.id === itemProduct)
            total += topping;

        return total;
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

            if (countError === 0) {
                let params = {
                    name: itemHoTen,
                    idBrand: itemBrand,
                    brandName: itemBrandName,
                    size: itemSize,
                    sugar: itemSugar.key,
                    ice: itemIce.key,
                    valueTopping: checkTopping,
                    toppingName: priceTopping,
                    idProduct: itemProduct,
                    productName: itemProductName,
                    price: renderPrice(selectedProduct),
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
        let lsSugar = localStorage.getItem('sugar');
        let lsIce = localStorage.getItem('ice');
        let lsSize = localStorage.getItem('size') === 'false' ? false : true;

        if (lsSugar)
            setItemSugarSetting(JSON.parse(lsSugar));

        if (lsIce)
            setItemIceSetting(JSON.parse(lsIce));

        if (lsSize)
            setItemSizeSetting(lsSize);
    }, [])

    useEffect(() => {
        if (fire) {
            if (
                typeof itemPre1 !== 'undefined' &&
                typeof itemPre2 !== 'undefined' &&
                typeof itemPre3 !== 'undefined' &&
                typeof itemPre4 !== 'undefined'
            ) {
                let val = valueProgress;
                interval.current = setInterval(() => {
                    val += Math.floor(Math.random() * 10) + 1;

                    if (val >= 100) {
                        val = 100;
                        let res1 = randomNumer().toFixed(0);
                        let res2 = randomNumer().toFixed(0);
                        let res3 = randomNumer().toFixed(0);
                        let res4 = randomNumer().toFixed(0);
                        let total = (parseInt(res1) + parseInt(res2) + parseInt(res3) + parseInt(res4)).toString();
                        let official = total.substring(total.length - 1, total.length);

                        if (official === 0 || official > brand.length)
                            official = randomNumerBrand.toFixed(0);
                            
                        let brandName = brand.find(c => c.value === parseInt(official)).label;
                        setItemRes1(res1);
                        setItemRes2(res2);
                        setItemRes3(res3);
                        setItemRes4(res4);
                        setItemOfficial(brandName);
                        setFire(false);
                        clearInterval(interval.current);

                        let params = {
                            duDoan1: itemPre1,
                            duDoan2: itemPre2,
                            duDoan3: itemPre3,
                            duDoan4: itemPre4,
                            ketQua1: parseInt(res1),
                            ketQua2: parseInt(res2),
                            ketQua3: parseInt(res3),
                            ketQua4: parseInt(res4),
                            brandName: brandName,
                            createdDate: new Date()
                        }

                        QuaySoHook.addQuaySo(params);
                    }

                    setValueProgress(val);
                }, 500);

                return () => {
                    if (interval.current) {
                        clearInterval(interval.current);
                        interval.current = null;
                    }
                }
            }
            else {
                Constants.showWarn(toast, 'Bạn chưa nhập các bộ số');
                setFire(false)
            }
        }
    }, [fire]);

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

    const bodyTopping = (value) => {
        if (typeof value.toppingName !== 'undefined') {
            const list = value.toppingName.map((item, key) => {
                return <div key={key}>{item.label}<br /></div>
            })

            return list;
        }
        else {
            return <div></div>
        }
    }

    const renderFooter = (
        <div>
            <Button label="Hủy" icon="pi pi-times" className='p-button-secondary' onClick={() => setShowModalRandom(false)} />
            <Button label="Quay số" icon="pi pi-check" onClick={() => onChangeQuaySo()} />
        </div>
    );

    const renderFooterSetting = (
        <div>
            <Button label="Hủy" icon="pi pi-times" className='p-button-secondary' onClick={() => setShowModalSetting(false)} />
            <Button label="Xác nhận" icon="pi pi-check" onClick={() => onChangeSetting()} />
        </div>
    );

    let footerGroup = <ColumnGroup>
        <Row>
            <Column footer="Tổng cộng:" />
            <Column footer={productTotal} />
            <Column colSpan={4} />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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
                                {/* <div className="flex justify-start">
                                    <InputNumber value={itemReduce}
                                        onValueChange={(e) => onChangeReduce(e.value)}
                                        placeholder='Giảm giá %'
                                        suffix='%'
                                        min={1}
                                        max={100} />
                                </div> */}
                                <div className='flex justify-start'>
                                    <Button icon='pi pi-sun'
                                        iconPos='left'
                                        className='p-button-help'
                                        label='Quay số'
                                        onClick={() => onChangeModalRandom()} />
                                </div>
                                <div className='flex justify-start'>
                                    <Button icon='pi pi-ellipsis-h'
                                        iconPos='right'
                                        className='p-button-secondary'
                                        onClick={() => onChangeModalSetting()} />
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
                                                                            name="sugar"
                                                                            value={category}
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
                                                                            name="ice"
                                                                            value={category}
                                                                            onChange={(e) => setItemIce(e.value)}
                                                                            checked={itemIce.key === category.key}
                                                                            className='mr-1' />
                                                                        <label htmlFor={category.key} className='mr-3'>{category.name}</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className='mt-2'>
                                                        <LabelMod name={'Topping'} />
                                                    </div>
                                                    <div className="flex" style={{ height: 140, overflowY: 'scroll' }}>
                                                        <div className='flex-row'>
                                                            {
                                                                topping.map((item, key) => {
                                                                    return (
                                                                        <div key={key} className='mb-1'>
                                                                            <Checkbox value={item.value} onChange={(e) => onChangeCheckTopping(e, item)} checked={checkTopping.indexOf(item.value) !== -1}></Checkbox>
                                                                            <label className="ml-1 p-checkbox-label">{item.label}</label>
                                                                            <label className='ml-1 text-cyan-500'>{item.price.toLocaleString()}</label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
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
                                                <div>
                                                    <LabelMod name={'Kích cỡ'} />
                                                </div>
                                                <div className='flex justify-content-center'>
                                                    <InputSwitch checked={itemSize} onChange={(e) => setItemSize(e.value)} />
                                                    <div className='font-bold ml-2 text-indigo-500'>
                                                        {itemSize === false ? 'Medium' : 'Large'}
                                                    </div>
                                                </div>
                                                <div className='mt-2'>
                                                    <LabelMod name={'Sản phẩm'} />
                                                    <label style={{ color: 'deeppink' }}>{product.length}</label>
                                                </div>
                                                {
                                                    isLoadingProduct &&
                                                    <ProgressBar mode="indeterminate" style={{ height: '6px' }} className='mt-2' />
                                                }
                                                {
                                                    !isLoadingProduct &&
                                                    <div className="flex" style={{ height: 500, overflowY: 'scroll' }}>
                                                        <div className='flex-row'>
                                                            {
                                                                product.map((item, key) => {
                                                                    return (
                                                                        <div
                                                                            key={key}
                                                                            className={(key + 1) !== product.length ? 'mr-2' : ''}
                                                                            style={{ width: 120, height: 290, float: 'left' }}
                                                                            onClick={() => onChangeProduct(item)}>
                                                                            <div style={{ borderWidth: 1, borderStyle: 'solid' }} className='border-indigo-50 p-5'>
                                                                                <Image
                                                                                    imageStyle={{ width: 120, height: 80 }}
                                                                                    src={item.content === '' ? item.path : item.content}
                                                                                    alt={item.label}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: 160, background: itemProduct === item.id ? '#90cd93' : '#4baaf5' }}>
                                                                                <div style={{ height: 130 }} className='text-white text-center p-2 tooltip-on-hover'>{item.label}</div>
                                                                                <div className="tooltip" style={{
                                                                                    backgroundColor: '#ff1493',
                                                                                    color: '#fff',
                                                                                    position: 'relative',
                                                                                    borderRadius: 5,
                                                                                    padding: 5
                                                                                }}>{item.description !== '' ? item.description : 'Không có mô tả'}</div>
                                                                                <div style={{ height: 30 }} className={(itemSize ? (item.priceForUpSize > 0 ? 'underline underline-offset-2 ' : '') : '') + 'text-white text-center font-bold'}>
                                                                                    {renderPrice(item).toLocaleString()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                }
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
                                    <Column field="valueTopping" header="Topping" body={bodyTopping}></Column>
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
                        <Dialog header="Người ấy là ai?" visible={showModalRandom} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowModalRandom(false)}>
                            <div>
                                <LabelMod name={'Thể lệ trò chơi'} />
                            </div>
                            <div>
                                <label className='text-indigo-500 font-bold'>Mỗi bộ số</label>
                                <label> là 1 con số dự đoán có giá trị từ {minConst + ' -> ' + maxConst}. Nếu bạn dự đoán </label>
                                <label className='text-green-500 font-bold'> trùng khớp với con số kết quả</label>
                                <label> thì bạn sẽ được mọi người bao trà sữa. Con số cuối cùng sẽ là con số thương hiệu mà bạn phải uống</label>
                            </div>
                            <div className="grid overflow-hidden grid-cols-2 grid-rows-1 gap-2 grid-flow-row">
                                <div className="box">
                                    <div>
                                        <LabelMod name={'Bộ số 1'} />
                                    </div>
                                    <div>
                                        <InputNumber value={itemPre1} onChange={(e) => setItemPre1(e.value)} placeholder={"Nhập giá trị từ " + minConst + " -> " + maxConst} min={minConst} max={maxConst} className='w-full' />
                                    </div>
                                </div>
                                <div className="box">
                                    <div>
                                        <LabelMod name={'Bộ số 2'} />
                                    </div>
                                    <div>
                                        <InputNumber value={itemPre2} onChange={(e) => setItemPre2(e.value)} placeholder={"Nhập giá trị từ " + minConst + " -> " + maxConst} min={minConst} max={maxConst} className='w-full' />
                                    </div>
                                </div>
                                <div className="box">
                                    <div>
                                        <LabelMod name={'Bộ số 3'} />
                                    </div>
                                    <div>
                                        <InputNumber value={itemPre3} onChange={(e) => setItemPre3(e.value)} placeholder={"Nhập giá trị từ " + minConst + " -> " + maxConst} min={minConst} max={maxConst} className='w-full' />
                                    </div>
                                </div>
                                <div className="box">
                                    <div>
                                        <LabelMod name={'Bộ số 4'} />
                                    </div>
                                    <div>
                                        <InputNumber value={itemPre4} onChange={(e) => setItemPre4(e.value)} placeholder={"Nhập giá trị từ " + minConst + " -> " + maxConst} min={minConst} max={maxConst} className='w-full' />
                                    </div>
                                </div>
                            </div>
                            {
                                fire &&
                                <ProgressBar value={valueProgress} className='mt-2'></ProgressBar>
                            }
                            {
                                valueProgress === 100 && !fire &&
                                <div>
                                    <div className="mt-2 bg-amber-200 p-5 grid overflow-hidden grid-cols-2 grid-rows-1 gap-2 grid-flow-row text-center text-white text-2xl">
                                        <div className="box">
                                            {
                                                itemRes1 !== -1 &&
                                                <span style={{ width: 100 }} className="text-5xl font-semibold inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 uppercase last:mr-0 mr-1">
                                                    {itemRes1}
                                                </span>
                                            }
                                        </div>
                                        <div className="box">
                                            {
                                                itemRes2 !== -1 &&
                                                <span style={{ width: 100 }} className="text-5xl font-semibold inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 uppercase last:mr-0 mr-1">
                                                    {itemRes2}
                                                </span>
                                            }
                                        </div>
                                        <div className="box">
                                            {
                                                itemRes3 !== -1 &&
                                                <span style={{ width: 100 }} className="text-5xl font-semibold inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 uppercase last:mr-0 mr-1">
                                                    {itemRes3}
                                                </span>
                                            }
                                        </div>
                                        <div className="box">
                                            {
                                                itemRes4 !== -1 &&
                                                <span style={{ width: 100 }} className="text-5xl font-semibold inline-block py-1 px-2 uppercase rounded text-green-600 bg-green-200 uppercase last:mr-0 mr-1">
                                                    {itemRes4}
                                                </span>
                                            }
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <span className="mt-2 w-full text-5xl font-semibold inline-block py-1 px-2 uppercase rounded text-rose-600 bg-rose-200 uppercase last:mr-0 mr-1">
                                            {itemOfficial}
                                        </span>
                                    </div>
                                </div>
                            }
                        </Dialog>
                        <Dialog header="Cài đặt mặc định" visible={showModalSetting} style={{ width: '50vw' }} footer={renderFooterSetting} onHide={() => setShowModalSetting(false)}>
                            <div>
                                <LabelMod name={'Phiên bản'} />
                            </div>
                            <div>
                                <span className="w-full text-xl font-semibold inline-block uppercase rounded text-sky-600 uppercase last:mr-0 mr-1">
                                    1.5
                                </span>
                            </div>
                            <div className='mt-2'>
                                <LabelMod name={'Tỷ lệ đường'} />
                            </div>
                            <div className='flex justify-content-center'>
                                {
                                    sugar.map((category) => {
                                        return (
                                            <div key={category.key} className="field-radiobutton">
                                                <RadioButton inputId={category.key}
                                                    name="sugar"
                                                    value={category}
                                                    onChange={(e) => setItemSugarSetting(e.value)}
                                                    checked={itemSugarSetting.key === category.key}
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
                                                    name="ice"
                                                    value={category}
                                                    onChange={(e) => setItemIceSetting(e.value)}
                                                    checked={itemIceSetting.key === category.key}
                                                    className='mr-1' />
                                                <label htmlFor={category.key} className='mr-3'>{category.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='mt-2'>
                                <LabelMod name={'Kích cỡ'} />
                            </div>
                            <div className='flex justify-content-center'>
                                <InputSwitch checked={itemSizeSetting} onChange={(e) => setItemSizeSetting(e.value)} />
                                <div className='font-bold ml-2 text-indigo-500'>
                                    {itemSizeSetting === false ? 'Medium' : 'Large'}
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </main>

                <Banner />

            </div>
        </div>
    );
}

export default Home;