import React, { useEffect, useState } from 'react';
import AdminIdeaCard from './AdminIdeaCard';
import styles from './AdminIdeaList.module.css';
import { getAllIdeasAndProblems } from '../../api/AdminApi/adminApi';

const AdminIdeaList = () => {
    const [ideas, setIdeas] = useState([]);
    const [filterBranch, setFilterBranch] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [archived, setArchived] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Mapowanie nazw statusów frontendowych na backendowe
    const statusMap = {
        oczekujące: 'pending',
        głosowanie: 'in_voting',
        realizacja: 'in_progress',
        zakończone: 'completed',
        odrzucone: 'rejected'
    };

    // Pobranie danych z backendu
    const fetchData = async () => {
        try {
            const response = await getAllIdeasAndProblems(archived);
            if (response) {
                setIdeas(response);
            }
        } catch (err) {
            console.error('Błąd podczas pobierania pomysłów:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [archived]);

    // Filtrowanie danych
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

    // Eksport pomysłów do pliku tekstowego
    const handleExportAll = () => {
        const lines = filteredIdeas.map((idea) => {
            const title = idea.title || '';
            const description = idea.description || '';
            const author = idea.author_email || 'Nieznany';
            const branch = idea.branch || 'Nieznana';
            return `${title};${description};${author};${branch}`;
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `wszystkie_pomysly_export.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Szukaj po tytule, opisie, autorze..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />

                <select onChange={(e) => setFilterBranch(e.target.value)} value={filterBranch}>
                    <option value="all">Wszystkie giełdy</option>
                    <option value="general">Giełda ogólna</option>
                    <option value="Łódź">Łódź</option>
                    <option value="Warszawa">Warszawa</option>
                    <option value="Kraków">Kraków</option>
                    <option value="Gdańsk">Gdańsk</option>
                </select>

                <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
                    <option value="all">Wszystkie statusy</option>
                    <option value="oczekujące">Oczekujące</option>
                    <option value="głosowanie">W trakcie głosowania</option>
                    <option value="realizacja">W trakcie realizacji</option>
                    <option value="zakończone">Zakończone</option>
                    <option value="odrzucone">Odrzucone</option>
                </select>

                <button onClick={() => setArchived(!archived)} className={styles.toggleButton}>
                    {archived ? 'Pokaż niezarchiwizowane' : 'Pokaż zarchiwizowane'}
                </button>

                {!archived && (
                    <button onClick={handleExportAll} className={styles.exportButton}>
                        Eksportuj wszystkie
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
