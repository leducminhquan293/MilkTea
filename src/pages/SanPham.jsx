import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx';

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
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import DanhSachHook from '../class/hooks/useDanhSach';
import Constants from '../class/constants';

function SanPham() {
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

    const onBasicUploadAuto = async (event) => {
        try {
            let count = 0;
            const file = event.files[0];
            let name = file.name;
            const reader = new FileReader();
            reader.onload = async (evt) => { // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                /* Update state */
                await SanPhamHook.deleteSanPham();

                for (let i = 1; i < data.length; i++) {
                    let params = {
                        value: data[i]['0'],
                        label: data[i]['1'],
                        content: data[i]['2'],
                        mime: data[i]['3'],
                        price: data[i]['4'],
                        priceForUpSize: data[i]['5'],
                        idBrand: data[i]['6'],
                        avaiable: data[i]['7'],
                    }

                    await SanPhamHook.addSanPham(params);
                    count++;
                }
            };
            reader.readAsBinaryString(file);
            Constants.showSuccess(toast, 'Đã import ' + count + '/' + data.length + ' kết quả')
        } catch (error) {
            alert(error)
        }
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
                            <h5>Basic with Auto</h5>
                            <FileUpload mode="basic" name="demo[]" accept=".xlsx" maxFileSize={1000000} uploadHandler={onBasicUploadAuto} customUpload chooseLabel="Import" />
                            {/* <FileUpload ref={this.imageRef} mode="basic" name="demo[]" chooseLabel="Tải hình ảnh tối đa 1 MB" accept="image/*" maxFileSize={1000000} className="mb-2" customUpload uploadHandler={this.uploadHinhAnh} /> */}
                        </div>
                    </div>
                </main>

                <Banner />

            </div>
        </div>
    );
}

export default SanPham;