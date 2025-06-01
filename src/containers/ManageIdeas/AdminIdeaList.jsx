import React, { useEffect, useState } from 'react';
import AdminIdeaCard from './AdminIdeaCard';
import styles from './AdminIdeaList.module.css';
import { getAllIdeasAndProblems } from '../../api/AdminApi/adminApi';
import { useTranslation } from 'react-i18next';

const AdminIdeaList = () => {
    const { t } = useTranslation();

    const [ideas, setIdeas] = useState([]);
    const [filterBranch, setFilterBranch] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [archived, setArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const statusMap = {
        oczekujące: 'pending',
        głosowanie: 'in_voting',
        realizacja: 'in_progress',
        zakończone: 'completed',
        odrzucone: 'rejected'
    };

    const fetchData = async () => {
        try {
            const response = await getAllIdeasAndProblems(archived);
            if (response) {
                setIdeas(response);
            }
        } catch (err) {
            console.error(t('Error while fetching ideas:'), err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [archived]);

    const filteredIdeas = ideas
        .filter((idea) => {
            if (filterBranch === 'all') return true;
            if (filterBranch === 'general') return idea.type === 'idea';
            return idea.branch === filterBranch && idea.type === 'problem';
        })
        .filter((idea) => {
            if (filterStatus === 'all') return true;
            return idea.status === statusMap[filterStatus];
        })
        .filter((idea) => {
            const query = searchQuery.toLowerCase();
            return (
                idea.title.toLowerCase().includes(query) ||
                idea.description.toLowerCase().includes(query) ||
                (idea.author && idea.author.toLowerCase().includes(query))
            );
        });

    const handleExportAll = () => {
        const lines = filteredIdeas.map((idea) => {
            const title = idea.title || '';
            const description = idea.description || '';
            const author = idea.author_email || t('Unknown');
            const branch = idea.branch || t('Unknown');
            return `${title};${description};${author};${branch}`;
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'export_all_ideas.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filterBar}>
                <input
                    type="text"
                    placeholder={t('Search by title, description, author...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />

                <select onChange={(e) => setFilterBranch(e.target.value)} value={filterBranch}>
                    <option value="all">{t('All departments')}</option>
                    <option value="general">{t('General stock')}</option>
                    <option value="Łódź">{t('Łódź')}</option>
                    <option value="Warszawa">{t('Warszawa')}</option>
                    <option value="Kraków">{t('Kraków')}</option>
                    <option value="Gdańsk">{t('Gdańsk')}</option>
                </select>

                <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                    <option value="all">{t('All statuses')}</option>
                    <option value="oczekujące">{t('Pending')}</option>
                    <option value="głosowanie">{t('In voting')}</option>
                    <option value="realizacja">{t('In progress')}</option>
                    <option value="zakończone">{t('Completed')}</option>
                    <option value="odrzucone">{t('Rejected')}</option>
                </select>

                <button onClick={() => setArchived(!archived)} className={styles.toggleButton}>
                    {archived ? t('Show unarchived') : t('Show archived')}
                </button>

                {!archived && (
                    <button onClick={handleExportAll} className={styles.exportButton}>
                        {t('Export all')}
                    </button>
                )}
            </div>

            <div className={styles.ideaList}>
                {filteredIdeas.map((idea) => (
                    <AdminIdeaCard
                        key={idea.id}
                        idea={idea}
                        onUpdate={fetchData}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminIdeaList;