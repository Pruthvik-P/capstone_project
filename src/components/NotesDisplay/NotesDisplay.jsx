import React, { useEffect, useRef, useState } from 'react';
import arrow from '../../assets/arrow.png';
import arrow2 from '../../assets/arrow2.png';
import back_arrow from '../../assets/back_arrow.png';
import styles from './NotesDisplay.module.css';
import { generateInitials } from '../../utils/constants';

export const NotesDisplay = (props) => {
    const [note, setNote] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem("createdGroups"));
        return storedData && storedData[props.groupId] ? storedData[props.groupId] : { notes: [] };
    });
    const [currentNote, setCurrentNote] = useState('');
    const text = useRef(null);
    const [enableSubmitButton, setEnableSubmitButton] = useState(false);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("createdGroups"));
        if (storedData && storedData[props.groupId]) {
            setNote(storedData[props.groupId]);
        } else {
            setNote({ notes: [] });
        }
    }, [props.groupId]);

    const handleText = (e) => {
        setCurrentNote(e.target.value);
        setEnableSubmitButton(e.target.value.trim().length > 0);
    };

    const handleSaveNotes = () => {
        if (!currentNote.trim()) return;

        const newNote = {
            text: currentNote.trim(),
            date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        };

        setNote((prevNote) => {
            const updatedNote = { ...prevNote };
            updatedNote.notes.push(newNote);
            const updatedData = JSON.parse(localStorage.getItem("createdGroups")) || {};
            updatedData[props.groupId] = updatedNote;
            localStorage.setItem("createdGroups", JSON.stringify(updatedData));
            setCurrentNote('');
            setEnableSubmitButton(false); // Disable the arrow button after saving
            return updatedNote;
        });
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <img onClick={() => props.goBack()} src={back_arrow} alt="back button" />
                <p style={{ backgroundColor: `${note.color}` }}>{generateInitials(note.text)}</p>
                <h1>{note?.text} </h1>
            </div>
            <div className={styles.notes_section}>
                {note.notes.length > 0 && note.notes.map((note, idx) => (
                    <div key={idx} className={styles.notes}>
                        <p>{note.text}</p>
                        <h4>{note.date} &bull; {note.time}</h4>
                    </div>
                ))}
            </div>
            <div className={styles.text_area}>
                <textarea
                    ref={text}
                    onChange={handleText}
                    value={currentNote}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveNotes();
                        }
                    }}
                    cols="130"
                    rows="10"
                    placeholder='Enter text here...'
                ></textarea>
                <img onClick={handleSaveNotes} src={enableSubmitButton ? arrow2 : arrow} alt="" />
            </div>
        </div>
    );
};
