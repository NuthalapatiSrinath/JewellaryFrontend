import React from 'react'
import FooterPage from '../FooterPage/FooterPage'
import VisitUsSection from '../../sections/VisitUsSection/VisitUsSection'
import styles from "./VisitUsPage.module.css"
const VisitUsPage = () => {
  return (
    <div className={styles.totalpage}>
        <VisitUsSection/>
     <FooterPage/>
    </div>
  )
}

export default VisitUsPage
