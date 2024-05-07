import React, { useState, useEffect, useRef } from 'react'
import styles from './Home.module.css'
import { NotesGroup } from '../../components/NotesGroup/NotesGroup'
import { NotesHome } from '../../components/NotesHome/NotesHome'
import { NotesDisplay } from '../../components/NotesDisplay/NotesDisplay'
import { Modal } from '../../components/Modal/Modal'
import { useModal } from '../../components/Modal/ModalContext'

export const Home = () => {
  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem("createdGroups"))) //for notes group 
  const [groupId, setGroupId] = useState()
  const [home, setHome] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [displayNotes, setDisplayNotes] = useState(false)
  const [back,setBack] = useState(false)
  const { showModal, setShowModal } = useModal();


  const updateGroups = (newGroup) => {
    setGroups(newGroup)
  }
  const getNotes = (id) => {
    setGroupId(id)
    setHome(false)
    setDisplayNotes(true)
    setBack(false)
  }
  const checkIsMobileView = () => {
    if (window.innerWidth <= 768) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  }
  const goBack = ()=>{
    setBack(true)
    setDisplayNotes(false)
  }
  useEffect(() => {
    localStorage.setItem("createdGroups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    checkIsMobileView();
    window.addEventListener('resize', checkIsMobileView);
    return () => {
      window.removeEventListener('resize', checkIsMobileView);
    };
  }, [])

  
  return (

    
    <div className={styles.main}>
      <div className={styles.left}>
        {!isMobileView && <NotesGroup setShowModal={setShowModal} groups={groups} getNotes={getNotes} />}
        {(!displayNotes && isMobileView) && <NotesGroup setShowModal={setShowModal} groups={groups} getNotes={getNotes} />}
        {(showModal && isMobileView) && <Modal updateGroups={updateGroups} />}
        {(displayNotes && isMobileView) && <NotesDisplay groupId={groupId} goBack={goBack}/>}
      </div>
      <div className={styles.right}>
        {!isMobileView && (home ? <NotesHome /> : <NotesDisplay groupId={groupId} />)}
        {showModal && !isMobileView && <Modal updateGroups={updateGroups} />}
      </div>
    </div>

  )
}