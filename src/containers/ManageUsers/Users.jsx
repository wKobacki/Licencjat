import React, { useEffect, useState } from 'react';
import {
    getUsers,
    deleteUser,
    updateUserRole,
    toggleUserBlock,
    updateUserBranch
} from '../../api/UserApi/usersApi';
import styles from './Users.module.css';

const Users = ({ userEmail }) => {
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
        if (window.confirm('Czy na pewno chcesz usunąć użytkownika?')) {
            await deleteUser(id, userEmail);
            loadUsers();
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const response = await updateUserRole(id, newRole, userEmail);
            await loadUsers(); 
        } catch (err) {
            console.error('Błąd przy zmianie roli:', err);
        }
    };
    

    const handleBlockToggle = async (id, isBlocked) => {
        await toggleUserBlock(id, isBlocked, userEmail);
        loadUsers();
    };

    const handleBranchChange = async (id, newBranch) => {
        await updateUserBranch(id, newBranch, userEmail);
        loadUsers();
    };

    const filteredUsers = users.filter((u) =>
        `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Zarządzanie użytkownikami</h2>

            <div className={styles.searchBarWrapper}>
                <input
                    type="text"
                    placeholder="Szukaj użytkownika..."
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
                            <span>Rola:</span> {u.role} | <span>Oddział:</span> {u.branch} | <span>Zablokowany:</span> {u.isBlocked ? 'Tak' : 'Nie'}
                        </div>
                        <div className={styles.userActions}>
                            <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className={styles.select}
                            >
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>

                            <select
                                value={u.branch}
                                onChange={(e) => handleBranchChange(u.id, e.target.value)}
                                className={styles.select}
                            >
                                <option value="Warszawa">Warszawa</option>
                                <option value="Łódź">Łódź</option>
                                <option value="Kraków">Kraków</option>
                                <option value="Gdańsk">Gdańsk</option>
                            </select>

                            <button onClick={() => handleBlockToggle(u.id, u.isBlocked)} className={styles.actionButton}>
                                {u.isBlocked ? 'Odblokuj' : 'Zablokuj'}
                            </button>

                            <button onClick={() => handleDelete(u.id)} className={styles.deleteButton}>
                                Usuń
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Users;