import React, { useState } from 'react';
import styles from './AdminIdeaCard.module.css';
import AdminCommentSection from '../../components/CommentSectionAdmin/AdminCommentSection';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
    updateIdeaStatus,
    archiveIdea,
    archiveProblem,
    deleteIdea,
    deleteProblem
} from '../../api/AdminApi/adminApi';
import { useTranslation } from 'react-i18next';

const AdminIdeaCard = ({ idea, onUpdate }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState(idea?.status || '');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (!idea) {
        return <div className={styles.error}>{t('Error: idea not provided.')}</div>;
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        try {
            await updateIdeaStatus(idea.id, newStatus, idea.type);
            onUpdate?.();
        } catch (err) {
            console.error(t('Error changing status:'), err);
        }
    };

    const handleArchive = async () => {
        try {
            const isArchived = idea.archived;
            if (idea.type === 'problem') {
                await archiveProblem(idea.id, !isArchived);
            } else {
                await archiveIdea(idea.id, !isArchived);
            }
            onUpdate?.();
        } catch (err) {
            console.error(t('Error while archiving:'), err);
        }
    };

    const handleDelete = async () => {
        try {
            if (idea.type === 'problem') {
                await deleteProblem(idea.id);
            } else {
                await deleteIdea(idea.id);
            }
            onUpdate?.();
        } catch (err) {
            console.error(t('Error while deleting:'), err);
        }
    };

    const handleExport = () => {
        const title = idea.title || '';
        const description = idea.description || '';
        const author = idea.author_email || t('Unknown');
        const branch = idea.type === 'problem' ? idea.branch || t('Unknown') : t('General stock');
        const txtContent = `${title};${description};${author};${branch}\n`;

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.replace(/\s+/g, '_')}_export.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const images = (idea.images || []).map(img => ({
        src: img.startsWith('/uploads/') ? `http://localhost:5000${img}` : `http://localhost:5000/uploads/${img}`
    }));

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className={styles.card}>
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>

            <div className={styles.info}>
                <p><strong>{t('Author')}:</strong> {idea.author_email || t('Unknown')}</p>
                <p><strong>{t('Stock idea')}:</strong> {idea.type === 'problem' ? idea.branch || t('Unknown') : t('General stock')}</p>
            </div>

            {images.length > 0 && (
                <div className={styles.imageGallery}>
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img.src}
                            alt={`idea-${idx}`}
                            className={styles.thumbnail}
                            onClick={() => openLightbox(idx)}
                        />
                    ))}
                </div>
            )}

            {lightboxOpen && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={images}
                />
            )}

            <div className={styles.actions}>
                <select value={status} onChange={handleStatusChange}>
                    <option value="pending">{t('Pending')}</option>
                    <option value="in_voting">{t('In voting')}</option>
                    <option value="in_progress">{t('In progress')}</option>
                    <option value="completed">{t('Completed')}</option>
                    <option value="rejected">{t('Rejected')}</option>
                </select>

                <button onClick={handleArchive} className={styles.archiveButton}>
                    {idea.archived ? t('Unarchive') : t('Archive')}
                </button>

                <button onClick={handleDelete} className={styles.deleteButton}>
                    {t('Delete')}
                </button>

                <button onClick={handleExport} className={styles.exportButton}>
                    {t('Export')}
                </button>
            </div>

            <AdminCommentSection ideaId={idea.id} ideaType={idea.type} />
        </div>
    );
};

export default AdminIdeaCard;
