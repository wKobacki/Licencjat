import React, { useRef, useState } from 'react';
import styles from './myIdeaForm.module.css';

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

    return (
        <section className={styles.formSection}>
            <form className={styles.problemForm} onSubmit={(e) => handleSubmit(e, files)} encType="multipart/form-data">
                <label htmlFor="title">{t('Title')}:</label>
                <input type="text" id="title" name="title" maxLength="55" required />

                <label htmlFor="department">{t('Select Department')}</label>
                <select id="department" name="department" required>
                    {["Safety improvement", "Quality improvement", "Efficiency improvement", "Increasing profits", "Communication improvement", "Deadline improvements", "Renovation, modernization and company image", "Loss reducing", "Cost reducing"].map((dept) => (
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
                    {files.length === 0
                        ? t('Drag & drop files here or click to select')
                        : files.map((file) => <div key={file.name}>{file.name}</div>)}
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
                    <button type="submit">{t('Submit')}</button>
                    <button type="button" onClick={handleCancel}>{t('Cancel')}</button>
                </div>
            </form>
        </section>
    );
};

export default MyIdeaForm;
