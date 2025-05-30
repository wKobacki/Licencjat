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
import CommentSection from '../../components/CommentSection/CommentSection';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const IdeasExchange = () => {
    const { t } = useTranslation();
    const userEmail = localStorage.getItem('userEmail');
    const userBranch = localStorage.getItem('userBranch');

    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votedIdeas, setVotedIdeas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (!userBranch || !userEmail) {
                console.warn('Brak danych użytkownika w localStorage.');
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
                console.error('Błąd podczas pobierania pomysłów:', error);
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
                console.warn('Nieprawidłowa odpowiedź z backendu:', res);
            }
        } catch (e) {
            console.error('Błąd przy głosowaniu:', e);
        }
    };

    const handleSubmit = async (e, files) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append('branch', userBranch);
        files.forEach(file => formData.append('images', file));

        const response = await submitIdea(formData, userEmail);
        console.log('Wysłano formularz:', response);
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
                    {ideas.map(idea => (
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

                            <CommentSection
                                itemId={idea.id}
                                itemType="idea"
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
