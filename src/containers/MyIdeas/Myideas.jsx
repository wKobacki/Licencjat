import React, { useEffect, useState } from 'react';
import styles from './MyIdeas.module.css';
import { getProblemsByBranch, voteForProblem } from '../../api/IdeasApi/myIdeasApi';
import { fetchUserBlockStatus } from '../../api/IdeasApi/ideasExchangeApi';
import MyIdeaForm from '../../components/MyIdeaForm/myIdeaForm';
import { useTranslation } from 'react-i18next';
import CommentSection from '../../components/CommentSection/CommentSection';
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const MyIdeas = () => {
    const { t } = useTranslation();
    const userEmail = localStorage.getItem('userEmail');
    const userBranch = localStorage.getItem('userBranch');

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votedProblems, setVotedProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxSlides, setLightboxSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!userBranch || !userEmail) {
                console.warn('Brak danych użytkownika w localStorage.');
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
    }, [userBranch, userEmail]);

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
                console.warn('Nieprawidłowa odpowiedź z backendu:', res);
            }
        } catch (e) {
            console.error('Błąd przy głosowaniu:', e);
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

        const response = await fetch('http://localhost:5000/submitProblem', {
            method: 'POST',
            headers: { 'x-user-email': userEmail },
            body: formData
        });

        const result = await response.json();
        console.log('Wysłano formularz:', result);
        form.reset();
        setShowForm(false);
        window.location.reload();
    };

    const openLightbox = (images, index) => {
        const slides = images.map(img => ({ src: `http://localhost:5000${img}` }));
        setLightboxSlides(slides);
        setCurrentIndex(index);
        setLightboxOpen(true);
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
                <div className={styles.problemList}>
                    {problems.map(problem => (
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
                                            src={`http://localhost:5000${img}`}
                                            alt={`problem-${idx}`}
                                            className={styles.thumbnail}
                                            onClick={() => openLightbox(problem.images, idx)}
                                        />
                                    ))}
                                </div>
                            )}

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

                            <CommentSection
                                itemId={problem.id}
                                itemType="problem"
                                userEmail={userEmail}
                            />
                        </div>
                    ))}
                </div>
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
