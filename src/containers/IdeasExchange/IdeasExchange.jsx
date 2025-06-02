import React, { useEffect, useState } from 'react';
import styles from './IdeasExchange.module.css';
import {
    fetchIdeas,
    voteForIdea,
    submitIdea,
    fetchUserBlockStatus
} from '../../api/IdeasApi/ideasExchangeApi';
import MyIdeaForm from '../../components/MyIdeaForm/myIdeaForm';
import { useTranslation } from 'react-i18next';
import Comments from '../../components/CommentSection/Comments';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const IdeasExchange = () => {
    const { t } = useTranslation();
    const userEmail = localStorage.getItem('userEmail');
    const userBranch = localStorage.getItem('userBranch');

    const [ideas, setIdeas] = useState([]);
    const [paginatedIdeas, setPaginatedIdeas] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [loading, setLoading] = useState(true);
    const [votedIdeas, setVotedIdeas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('date_desc');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (!userBranch || !userEmail) {
                console.warn('Missing user data in localStorage.');
                setIdeas([]);
                setLoading(false);
                return;
            }

            try {
                const fetchedIdeas = await fetchIdeas(userEmail);
                setIdeas(fetchedIdeas);

                const voted = fetchedIdeas
                    .filter(idea => idea.hasVoted)
                    .map(idea => idea.id);
                setVotedIdeas(voted);
            } catch (error) {
                console.error('Error fetching ideas:', error);
                setIdeas([]);
            }

            setLoading(false);
        };

        const fetchBlockStatus = async () => {
            const status = await fetchUserBlockStatus(userEmail);
            setIsBlocked(status.isBlocked);
        };

        fetchData();
        fetchBlockStatus();
    }, [userBranch, userEmail]);

    useEffect(() => {
        let filteredIdeas = ideas.filter(idea =>
            idea.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filteredIdeas.sort((a, b) => {
            switch (sortOption) {
                case 'votes_asc':
                    return a.votes - b.votes;
                case 'votes_desc':
                    return b.votes - a.votes;
                case 'date_asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'date_desc':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPaginatedIdeas(filteredIdeas.slice(start, end));
        setTotalPages(Math.ceil(filteredIdeas.length / itemsPerPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [ideas, currentPage, searchQuery, sortOption]);

    const handleVote = async (ideaId) => {
        try {
            const res = await voteForIdea(ideaId, userEmail);
            if (res && typeof res.totalVotes === 'number') {
                setVotedIdeas(prev =>
                    prev.includes(ideaId)
                        ? prev.filter(id => id !== ideaId)
                        : [...prev, ideaId]
                );

                setIdeas(prevIdeas =>
                    prevIdeas.map(idea =>
                        idea.id === ideaId
                            ? { ...idea, votes: res.totalVotes }
                            : idea
                    )
                );
            } else {
                console.warn('Invalid backend response:', res);
            }
        } catch (e) {
            console.error('Error voting:', e);
        }
    };

    const handleSubmit = async (e, files) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append('branch', userBranch);
        files.forEach(file => formData.append('images', file));

        const response = await submitIdea(formData, userEmail);
        console.log('Form submitted:', response);
        form.reset();
        setShowForm(false);
        window.location.reload();
    };

    const getStatusClass = (status) => {
        return {
            'in_progress': styles['status-in_progress'],
            'in_voting': styles['status-in_voting'],
            'completed': styles['status-completed'],
            'rejected': styles['status-rejected'],
        }[status] || '';
    };

    const openLightbox = (images, index) => {
        const fullPaths = images.map(img => ({ src: `http://localhost:5000${img}` }));
        setLightboxImages(fullPaths);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            {!isBlocked ? (
                <div className={styles.centerButton}>
                    <button className={styles.addButton} onClick={() => setShowForm(true)}>
                        + {t('Add new idea')}
                    </button>
                </div>
            ) : (
                <div className={styles.blockedMessage}>
                    {t('You are blocked and cannot submit new ideas.')}
                </div>
            )}

            {showForm && !isBlocked && (
                <MyIdeaForm
                    t={t}
                    handleSubmit={handleSubmit}
                    handleCancel={() => setShowForm(false)}
                    branchFromQuery={userBranch}
                />
            )}

            {loading ? (
                <p>{t('Loading...')}</p>
            ) : (
                <>
                    <div className={styles.filters}>
                        <input
                            type="text"
                            placeholder={t('Search by title')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="date_desc">{t('Newest first')}</option>
                            <option value="date_asc">{t('Oldest first')}</option>
                            <option value="votes_desc">{t('Most votes')}</option>
                            <option value="votes_asc">{t('Fewest votes')}</option>
                        </select>
                    </div>

                    <div className={styles.problemList}>
                        {paginatedIdeas.map(idea => (
                            <div key={idea.id} className={styles.problemCard}>
                                <span className={`${styles.statusTag} ${getStatusClass(idea.status)}`}>
                                    {t(idea.status.replace('_', ' '))}
                                </span>
                                <h3>{idea.title}</h3>
                                <p>{idea.description}</p>
                                <p>{idea.solution}</p>

                                {idea.images?.length > 0 && (
                                    <div className={styles.imageGallery}>
                                        {idea.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={`http://localhost:5000${img}`}
                                                alt={`idea-${idx}`}
                                                className={styles.thumbnail}
                                                onClick={() => openLightbox(idea.images, idx)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {idea.status === 'in_voting' && (
                                    <div className={styles.voteButtonContainer}>
                                        <button
                                            className={`${styles.voteButton} ${votedIdeas.includes(idea.id) ? styles.voted : ''}`}
                                            onClick={() => handleVote(idea.id)}
                                        >
                                            {votedIdeas.includes(idea.id) ? t('Unvote') : t('Vote')}
                                        </button>
                                        <span className={styles.voteCount}>
                                            {t('Votes')}: {idea.votes}
                                        </span>
                                    </div>
                                )}

                                <Comments
                                    itemId={idea.id}
                                    itemType="idea"
                                    userEmail={userEmail}
                                />
                            </div>
                        ))}
                    </div>

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
                </>
            )}

            {lightboxOpen && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxImages}
                    index={lightboxIndex}
                    on={{
                        view: ({ index }) => setLightboxIndex(index),
                    }}
                />
            )}
        </div>
    );
};

export default IdeasExchange;
