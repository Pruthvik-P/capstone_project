import React, { useEffect, useState, useRef } from 'react';
import styles from './Modal.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { colors } from '../../utils/constants';
import { useModal } from './ModalContext';

export const Modal = (props) => {
    const [groupName, setGroupName] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [createdGroups, setCreatedGroups] = useState([]);
    const [selectedColorIndex, setSelectedColorIndex] = useState(null);
    const { showModal, setShowModal } = useModal();
    const modalRef = useRef(null);

    useEffect(() => {
        const storedGroups = JSON.parse(localStorage.getItem("createdGroups"));
        if (storedGroups) {
            setCreatedGroups(storedGroups);
        }
    }, []);

    const handleColor = (idx) => {
        setSelectedColor(colors[idx]);
        setSelectedColorIndex(idx);
    };

    const handleChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleCreate = () => {
        if (groupName && selectedColor) {
            const isDuplicate = createdGroups.some(group => group.text === groupName);
            if (!isDuplicate) {
                const newGroup = {
                    id: createdGroups.length,
                    text: groupName,
                    color: selectedColor,
                    notes: []
                };
                const updatedGroups = [...createdGroups, newGroup];
                localStorage.setItem("createdGroups", JSON.stringify(updatedGroups));
                props.updateGroups(updatedGroups);
                setGroupName("");
                setSelectedColor(null);
                setShowModal(false);
                toast.success("Group Created Successfully!!");
            } else {
                toast.error('Group Name already Exists!');
            }
        } else {
            toast.error('Please Enter Group Name and Select Color !!');
        }
    };

    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideModal);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [setShowModal]);

    return (
        <>
            {showModal && <div className={styles.backdrop}></div>}
            <div className={styles.container} id="modal" ref={modalRef} style={{ display: showModal ? 'flex' : 'none' }}>
                <div className={styles.content}>
                    <h1>Create New Group</h1>
                    <div className={styles.text}>
                        <label htmlFor="group">Group Name <input maxLength={15} onChange={(e) => handleChange(e)} type="text" name="group" placeholder='Enter Group Name' /></label>
                    </div>
                    <div className={styles.colors}>
                        <h1>Choose Color</h1>
                        {colors.map((color, index) => (
                            <div key={index} className={styles.color}>
                                <p style={{
                                    background: `${color}`,
                                    border: selectedColorIndex === index ? '3px solid grey' : 'none'
                                }} onClick={() => handleColor(index)}></p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.btn}>
                    <button onClick={handleCreate}>Create</button>
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        closeButton={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark" />
                </div>
            </div>
        </>
    );
};
