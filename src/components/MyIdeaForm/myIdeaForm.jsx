import React, { useRef, useState } from 'react';
import styles from './myIdeaForm.module.css';
import { Trash2 } from 'lucide-react';

const MyIdeaForm = ({ t, handleSubmit, handleCancel, branchFromQuery }) => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 3);
        setFiles(droppedFiles);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 3);
        setFiles(selectedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <section className={styles.formSection}>
            <form className={styles.problemForm} onSubmit={(e) => handleSubmit(e, files)} encType="multipart/form-data">
                <label htmlFor="title">{t('Title')}:</label>
                <input type="text" id="title" name="title" maxLength="55" required />

                <label htmlFor="department">{t('Select Department')}</label>
                <select id="department" name="department" required defaultValue={branchFromQuery || ''}>
                    {[
                        'Safety improvement',
                        'Quality improvement',
                        'Efficiency improvement',
                        'Increasing profits',
                        'Communication improvement',
                        'Deadline improvements',
                        'Renovation, modernization and company image',
                        'Loss reducing',
                        'Cost reducing',
                    ].map((dept) => (
                        <option key={dept} value={dept}>{t(dept)}</option>
                    ))}
                </select>

                <label htmlFor="description">{t('Description')}:</label>
                <textarea id="description" name="description" rows="4" maxLength="1000" required></textarea>

                <label htmlFor="solution">{t('Solution Description')}:</label>
                <textarea id="solution" name="solution" rows="4" maxLength="1000" required></textarea>

                <label>{t('Attach Images (up to 3)')}:</label>
                <div
                    className={styles.dropZone}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                >
                    {files.length === 0 ? (
                        <p>{t('Drag & drop files here or click to select')}</p>
                    ) : (
                        <ul className={styles.previewList}>
                            {files.map((file, index) => (
                                <li key={file.name} className={styles.previewItem}>
                                    <span>{file.name}</span>
                                    <Trash2 className={styles.trashIcon} onClick={(e) => { e.stopPropagation(); removeFile(index); }} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <div className={styles.buttons}>
                    <button type="submit" className={styles.submit}>{t('Submit')}</button>
                    <button type="button" onClick={handleCancel} className={styles.cancel}>{t('Cancel')}</button>
                </div>
            </form>
        </section>
    );
};

export default MyIdeaForm;