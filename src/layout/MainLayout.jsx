import React from 'react';
import MenuBar from '../components/MenuBar/MenuBar';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = ({ userRole, onLogout }) => {
    return (
        <>
            <MenuBar userRole={userRole} onLogout={onLogout} isLoggedIn={!!userRole} />
            <div className={styles.outletWrapper}>
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;