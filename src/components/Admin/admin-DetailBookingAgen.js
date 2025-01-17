import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallApi from '../CallApi';
import Adminmenu from "./admin-menu";
import UserAdmin from '../../list/userIAdmin';
export default function AdminDetailBookingAgen() {
    const { id } = useParams(); // Lấy id từ URL
    const getAgencyId = parseInt(id);
    const [BookReservation, setBookReservation] = useState([]);
    const [realEstates, setRealEstates] = useState([]); // State to store real estates
    const [accounts, setAccounts] = useState([]); // State to store accounts
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllReservations = await CallApi.getAllReservations();
                const getAgenId = getAllReservations.filter(reservation => reservation.status === 2 && reservation.agencyId === getAgencyId);
                setBookReservation(getAgenId);
                const callDataRealEstateData = await CallApi.getAllRealEstate();
                setRealEstates(callDataRealEstateData);
                const callDataAllAccount = await CallApi.getAllAccount();
                setAccounts(callDataAllAccount); // Set accounts data
            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, [getAgencyId]);
    const getRealEstateNameById = (realEstateId) => {
        const realEstate = realEstates.find(item => item.id === realEstateId);
        return realEstate ? realEstate.realestateName : 'Unknown';
    };
    const getUsernameByCustomerId = (customerId) => {
        const account = accounts.find(item => item.id === customerId);
        return account ? account.username : 'Unknown';
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };
    return (

        <div className=" admin-all-account">
            <div>
                <Adminmenu
                    userLoginBasicInformationDto={userLoginBasicInformationDto}
                    UserMenu={UserAdmin}
                />
            </div>
            <div className='table-container' style={{marginRight:'100px'}}>
                <div className=''>
                    <h1 className="account-list-title" style={{marginTop:'100px', fontWeight:'bold'}}>Chi tiết đơn đặt Agency</h1>
                </div>
                {BookReservation.length > 0 ? (
                    <table className="admin-DB-table">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Tên bất động sản</th>
                                <th>Tên khách hàng đặt chỗ</th>
                                <th>Ngày xem</th>
                                <th>Giờ xem</th>
                                <th>Người dẫn đi xem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BookReservation.map((reservation, index) => (
                                <tr key={index}>
                                    <td>{reservation.id}</td>
                                    <td>{getRealEstateNameById(reservation.realEstateId)}</td>
                                    <td>{getUsernameByCustomerId(reservation.customerId)}</td>
                                    <td>{formatDate(reservation.bookingDate)}</td>
                                    <td>{reservation.bookingTime}</td>
                                    <td>{reservation.agencyId !== null ? getUsernameByCustomerId(reservation.agencyId) : 'Đang Cập Nhật'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Đang tải dữ liệu.</p>
                )}

                <div className="admin-DB-button-container">
                    <Link to="/admin-sodondatchoagency" className="admin-DB-button-link">
                        <button className="admin-DB-button" style={{textAlign:'left'}}>Quay lại</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
