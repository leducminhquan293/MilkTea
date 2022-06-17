import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import Banner from '../partials/Banner';
import Constants from '../class/constants';
import Header from '../partials/Header';
import SanPhamHook from '../class/hooks/useSanPham';
import Sidebar from '../partials/Sidebar';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

function SanPham() {
    const toast = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const importRef = useRef();

    const onBasicUploadAuto = async (event) => {
        try {
            let count = 0;
            let total = 0;
            const file = event.files[0];
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
                total = data.length;
                /* Update state */
                await SanPhamHook.deleteSanPham();

                for (let i = 1; i < data.length; i++) {
                    let params = {
                        value: typeof data[i]['0'] !== 'undefined' ? data[i]['0'] : -1,
                        label: typeof data[i]['1'] !== 'undefined' ? data[i]['1'] : '',
                        content: typeof data[i]['2'] !== 'undefined' ? data[i]['2'] : '',
                        path: typeof data[i]['3'] !== 'undefined' ? data[i]['3'] : '',
                        description: typeof data[i]['4'] !== 'undefined' ? data[i]['4'] : '',
                        mime: typeof data[i]['5'] !== 'undefined' ? data[i]['5'] : '',
                        price: typeof data[i]['6'] !== 'undefined' ? data[i]['6'] : -1,
                        priceForUpSize: typeof data[i]['7'] !== 'undefined' ? data[i]['7'] : -1,
                        idBrand: typeof data[i]['8'] !== 'undefined' ? data[i]['8'] : -1,
                        avaiable: typeof data[i]['9'] !== 'undefined' ? data[i]['9'] : true
                    }

                    await SanPhamHook.addSanPham(params);
                    count++;
                }
            };
            reader.readAsBinaryString(file);
            importRef.current.clear();
            Constants.showSuccess(toast, 'Đã import dữ liệu')
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
                            <div className='font-bold text-3xl'>Import dữ liệu Sản phẩm với file excel</div>
                            <a href='../../dist/assets/MilkTeaData.xlsx' download>Download file excel tại đây</a>
                            <FileUpload ref={importRef} mode="basic" name="demo[]" accept=".xlsx" maxFileSize={10000000} uploadHandler={onBasicUploadAuto} customUpload chooseLabel="Import" />
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