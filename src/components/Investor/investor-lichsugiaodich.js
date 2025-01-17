import React, { useState, useEffect } from 'react';
import InvestorMenu from './investor-menu';
import UserInvestor from '../../list/userInvestor';
import CallApi from '../CallApi';

export default function CustomerLichsugiaodich() {
    const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
    const [historyWallet, setHistoryWallet] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllWallet = await CallApi.getAllWallet();
                const getIdInvestorWallet = getAllWallet.filter(IdInvestor => IdInvestor.investorId === userLoginBasicInformationDto.accountId);
                const id = getIdInvestorWallet.map(idt => idt.id)
                const getAllWalletHistory = await CallApi.getAllWalletHistorylWallet();
                const accountBalances = getAllWalletHistory.filter(wallet => wallet.walletId === parseInt(id));
                setHistoryWallet(accountBalances.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)));

            } catch (error) {
                console.error('Error at fetchData', error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const utcTime = date.getTime();
        const vietnamTimeOffset = 15 * 60 * 60 * 1000; // UTC+7
        const vietnamTime = new Date(utcTime + vietnamTimeOffset);
        const formattedTime = vietnamTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        return formattedTime;
    };

    const getDescriptionColor = (description) => {
        if (description.includes('nạp')) {
            return 'text-success'; // Màu xanh
        } else if (description.includes('trừ')) {
            return 'text-danger'; // Màu đỏ
        }
        return ''; // Không tô màu
    };

    return (
        <div className='container'>
            <InvestorMenu
                userLoginBasicInformationDto={userLoginBasicInformationDto}
                UserMenu={UserInvestor}
            />
            <div className='col-md-9 lichsugiaodichtaikhoan'>
                <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Lịch sử giao dịch</h2>
                <table className="table">
                    <thead>
                        <tr>
                            {/* <th>STT</th> */}
                            <th>ID giao dịch</th>
                            <th>Ngày giao dịch</th>
                            <th>Thời gian giao dịch </th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>{historyWallet.map((transaction, index) => (
                        <tr key={index}>
                            {/* <td>{index+1}</td> */}
                            <td>{transaction.id}</td>
                            <td>{formatDate(transaction.createAt)}</td>
                            <td>{formatTime(transaction.createAt)}</td>
                            <td className={getDescriptionColor(transaction.description)}>{transaction.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}