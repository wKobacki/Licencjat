import React, { useEffect, useState } from 'react';
import {
    getUsers,
    deleteUser,
    updateUserRole,
    toggleUserBlock,
    updateUserBranch
} from '../../api/UserApi/usersApi';
import styles from './Users.module.css';
import { useTranslation } from 'react-i18next';

const Users = ({ userEmail }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const loadUsers = async () => {
        const data = await getUsers(userEmail);
        setUsers(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this user?'))) {
            await deleteUser(id, userEmail);
            loadUsers();
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserRole(id, newRole, userEmail);
            await loadUsers(); 
        } catch (err) {
            console.error(t('Error changing role:'), err);
        }
    };

    const handleBlockToggle = async (id, isBlocked) => {
        await toggleUserBlock(id, isBlocked, userEmail);
        loadUsers();
    };

    const handleBranchChange = async (id, newBranch) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, branch: newBranch } : user
            )
        );

        try {
            await updateUserBranch(id, newBranch, userEmail);

            const currentUserEmail = localStorage.getItem('userEmail');
            const updatedUser = users.find(u => u.id === id);
            if (updatedUser && updatedUser.email === currentUserEmail) {
                localStorage.setItem('userBranch', newBranch);
            }

            await loadUsers();
        } catch (err) {
            console.error(t('Error changing branch:'), err);
        }
    };

    const filteredUsers = users.filter((u) =>
        `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>

            <div className={styles.searchBarWrapper}>
                <input
                    type="text"
                    placeholder={t('Search user...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <ul className={styles.userList}>
                {paginatedUsers.map((u) => (
                    <li key={u.id} className={styles.userCard}>
                        <div className={styles.userDetails}>
                            <strong>{u.name} {u.surname}</strong> ({u.email})<br />
                            <span>{t('Branch')}:</span> {u.branch} | <span>{t('Blocked')}:</span> {u.isBlocked ? t('Yes') : t('No')}
                        </div>
                        <div className={styles.userActions}>
                            <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className={styles.select}
                            >
                                <option value="user">{t('User')}</option>
                                <option value="manager">{t('Manager')}</option>
                                <option value="admin">{t('Admin')}</option>
                            </select>

                            <select
                                value={u.branch}
                                onChange={(e) => handleBranchChange(u.id, e.target.value)}
                                className={styles.select}
                            >
                                <option value="Warszawa">{t('Warsaw')}</option>
                                <option value="Łódź">{t('Lodz')}</option>
                                <option value="Kraków">{t('Krakow')}</option>
                                <option value="Gdańsk">{t('Gdansk')}</option>
                            </select>

                            <button onClick={() => handleBlockToggle(u.id, u.isBlocked)} className={styles.actionButton}>
                                {u.isBlocked ? t('Unblock') : t('Block')}
                            </button>

                            <button onClick={() => handleDelete(u.id)} className={styles.deleteButton}>
                                {t('Delete')}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                    >
                        ‹
                    </button>

                    {currentPage > 2 && (
                        <button
                            onClick={() => handlePageChange(1)}
                            className={`${styles.pageButton} ${currentPage === 1 ? styles.activePage : ''}`}
                        >
                            1
                        </button>
                    )}

                    {currentPage > 3 && <span className={styles.pageDots}>...</span>}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                            (page) =>
                                page === currentPage ||
                                page === currentPage - 1 ||
                                page === currentPage + 1
                        )
                        .map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                            >
                                {page}
                            </button>
                        ))}

                    {currentPage < totalPages - 2 && <span className={styles.pageDots}>...</span>}

                    {currentPage < totalPages - 1 && (
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className={`${styles.pageButton} ${currentPage === totalPages ? styles.activePage : ''}`}
                        >
                            {totalPages}
                        </button>
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};

export default Users;
