import React, { useEffect, useState } from 'react';
import styles from './MyIdeas.module.css';
import {
    getProblemsByBranch,
    voteForProblem
} from '../../api/IdeasApi/myIdeasApi';
import { fetchUserBlockStatus } from '../../api/IdeasApi/ideasExchangeApi';
import MyIdeaForm from '../../components/MyIdeaForm/myIdeaForm';
import { useTranslation } from 'react-i18next';
import Comments from '../../components/CommentSection/Comments';
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const API_URL = process.env.REACT_APP_API_URL;

const MyIdeas = () => {
    const { t } = useTranslation();
    const userEmail = localStorage.getItem('userEmail');
    const userBranch = localStorage.getItem('userBranch');

    const [problems, setProblems] = useState([]);
    const [paginatedProblems, setPaginatedProblems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [votedProblems, setVotedProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('date_desc');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!userBranch || !userEmail) {
                console.warn(t('Missing user data.'));
                setProblems([]);
                setVotedProblems([]);
                setLoading(false);
                return;
            }

            const problemsData = await getProblemsByBranch(userBranch, userEmail);
            const fetchedProblems = Array.isArray(problemsData.problems) ? problemsData.problems : [];

            setProblems(fetchedProblems);
            const voted = fetchedProblems.filter(p => p.hasVoted).map(p => p.id);
            setVotedProblems(voted);
            setLoading(false);
        };

        const fetchBlockStatus = async () => {
            const status = await fetchUserBlockStatus(userEmail);
            setIsBlocked(status.isBlocked);
        };

        fetchData();
        fetchBlockStatus();
    }, [userBranch, userEmail, t]);

    useEffect(() => {
        let filtered = problems.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
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
        setPaginatedProblems(filtered.slice(start, end));
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [problems, currentPage, searchQuery, sortOption]);

    const handleVote = async (problemId) => {
        try {
            const res = await voteForProblem(problemId, userEmail);
            if (res && typeof res.totalVotes === 'number') {
                setVotedProblems(prev =>
                    prev.includes(problemId)
                        ? prev.filter(id => id !== problemId)
                        : [...prev, problemId]
                );

                setProblems(prevProblems =>
                    prevProblems.map(problem =>
                        problem.id === problemId
                            ? { ...problem, votes: res.totalVotes }
                            : problem
                    )
                );
            } else {
                console.warn(t('Invalid backend response'), res);
            }
        } catch (e) {
            console.error(t('Voting error'), e);
        }
    };

    const getStatusClass = (status) => {
        return {
            'in_progress': styles['status-in_progress'],
            'in_voting': styles['status-in_voting'],
            'completed': styles['status-completed'],
            'rejected': styles['status-rejected'],
        }[status] || '';
    };

    const handleSubmit = async (e, files) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData();
        formData.append('title', form.title.value);
        formData.append('department', form.department.value);
        formData.append('description', form.description.value);
        formData.append('solution', form.solution.value);
        formData.append('branch', userBranch);
        files.forEach(file => formData.append('images', file));

        const response = await fetch(`${API_URL}/submitProblem`, {
            method: 'POST',
            headers: { 'x-user-email': userEmail },
            body: formData
        });

        const result = await response.json();
        console.log(t('Form sent'), result);
        form.reset();
        setShowForm(false);
        window.location.reload();
    };

    const openLightbox = (images, index) => {
        const slides = images.map(img => ({ src: `${API_URL}${img}` }));
        setLightboxSlides(slides);
        setCurrentIndex(index);
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
                        <div className={styles.searchAndSort}>
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
                    </div>

                    <div className={styles.problemList}>
                        {paginatedProblems.map(problem => (
                            <div key={problem.id} className={styles.problemCard}>
                                <span className={`${styles.statusTag} ${getStatusClass(problem.status)}`}>
                                    {t(problem.status.replace('_', ' '))}
                                </span>
                                <h3>{problem.title}</h3>
                                <p>{problem.description}</p>
                                <p>{problem.solution}</p>

                                {problem.images?.length > 0 && (
                                    <div className={styles.imageGallery}>
                                        {problem.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={`${API_URL}${img}`}
                                                alt={`problem-${idx}`}
                                                className={styles.thumbnail}
                                                onClick={() => openLightbox(problem.images, idx)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {problem.status === 'in_voting' && (
                                    <div className={styles.voteButtonContainer}>
                                        <button
                                            className={`${styles.voteButton} ${votedProblems.includes(problem.id) ? styles.voted : ''}`}
                                            onClick={() => handleVote(problem.id)}
                                        >
                                            {votedProblems.includes(problem.id) ? t('Unvote') : t('Vote')}
                                        </button>
                                        <span className={styles.voteCount}>
                                            {t('Votes')}: {problem.votes}
                                        </span>
                                    </div>
                                )}

                                <Comments
                                    itemId={problem.id}
                                    itemType="problem"
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
                    slides={lightboxSlides}
                    index={currentIndex}
                    on={{ view: ({ index }) => setCurrentIndex(index) }}
                    plugins={[Thumbnails]}
                />
            )}
        </div>
    );
};

export default MyIdeas;
