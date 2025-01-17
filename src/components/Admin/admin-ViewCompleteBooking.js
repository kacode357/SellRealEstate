import React, { useEffect, useState } from 'react';
import CallApi from '../CallApi';
import Adminmenu from "./admin-menu";
import UserAdmin from '../../list/userIAdmin';

export default function AdminViewCompleteBooking() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const [CompleteRes, setCompleteRes] = useState([]); // State to store accounts
    const [realEstates, setRealEstates] = useState([]);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllReservation = await CallApi.getAllReservations();
                const getCompleteRes = getAllReservation.filter(CompleteRes => CompleteRes.status === 3);
                setCompleteRes(getCompleteRes);
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccounts(callDataAllAccount);
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, []);
    const getRealEstateNameById = (realEstateId) => {
        const realEstate = realEstates.find(item => item.id === realEstateId);
        return realEstate ? realEstate.realestateName : 'Dữ liệu đang tải';
    };

    const getUsernameByCustomerId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Dữ liệu đang tải';
    };
    const getUsernameByAgencyId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Chưa Chọn Agency';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };
    return (
        <div className="admin-all-account">
            <div>
                <Adminmenu
                    userLoginBasicInformationDto={userLoginBasicInformationDto}
                    UserMenu={UserAdmin}
                />
            </div>
            <div className='table-container' style={{marginRight:'100px'}}>
                <h1 style={{ fontSize: '30px', fontWeight:'bold', marginTop:'100px' }}>Danh Sách Đã Hoàn Thành Dẫn Đi Xem</h1>
                <table className=''>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên bất động sản</th>
                            <th>Tên khách hàng</th>
                            <th>Ngày xem</th>
                            <th>Giờ xem</th>
                            <th>Người dẫn xem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CompleteRes.map((res,index) => (
                            <tr key={res.id}>
                                <td>{index+1}</td>
                                <td>{getRealEstateNameById(res.realEstateId)}</td>
                                <td>{getUsernameByCustomerId(res.customerId)}</td>
                                <td>{formatDate(res.bookingDate)}</td>
                                <td>{res.bookingTime}</td>
                                <td>{getUsernameByAgencyId(res.agencyId)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
