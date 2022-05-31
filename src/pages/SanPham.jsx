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

const SanPham = () => {
    return (
        <div>
            <h5>Basic with Auto</h5>
            <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="excel/" maxFileSize={1000000} onUpload={onBasicUploadAuto} auto chooseLabel="Browse" />
        </div>
    )
}

export default SanPham;