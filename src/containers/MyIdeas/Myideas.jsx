import React, { useEffect, useState } from 'react';
import styles from './MyIdeas.module.css';
import { getProblemsByBranch, voteForProblem } from '../../api/IdeasApi/myIdeasApi';
import MyIdeaForm from '../../components/MyIdeaForm/myIdeaForm';
import { useTranslation } from 'react-i18next';
import CommentSection from '../../components/CommentSection/CommentSection';

const MyIdeas = () => {
    const { t } = useTranslation();
    const userEmail = localStorage.getItem('userEmail');
    const userBranch = localStorage.getItem('userBranch');

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votedProblems, setVotedProblems] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            if (!userBranch || !userEmail) {
                console.warn('Brak danych użytkownika w localStorage.');
                setProblems([]);
                setLoading(false);
                return;
            }
            const data = await getProblemsByBranch(userBranch, userEmail);
            if (Array.isArray(data.problems)) {
                setProblems(data.problems);
            } else {
                setProblems([]);
            }
            setLoading(false);
        };
        fetchProblems();
    }, [userBranch, userEmail]);

    const handleVote = async (problemId) => {
        if (votedProblems.includes(problemId)) {
            setVotedProblems(votedProblems.filter(id => id !== problemId));
        } else {
            await voteForProblem(problemId, userEmail);
            setVotedProblems([...votedProblems, problemId]);
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
        const formData = new FormData(form);
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

    return (
        <div className={styles.container}>
            <h3>{t('Your Ideas')}</h3>

            <button className={styles.addButton} onClick={() => setShowForm(true)}>
                + {t('Add new idea')}
            </button>

            {showForm && (
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

                            {problem.images && (
                                <div className={styles.imageGallery}>
                                    {problem.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`http://localhost:5000/uploads/${img}`}
                                            alt={`problem-${idx}`}
                                            className={styles.thumbnail}
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
        </div>
    );
};

export default MyIdeas;
