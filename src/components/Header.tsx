import styles from './Header.module.css'
import { Menu } from 'lucide-react'

const Header = () => {
  return (
    <section className={styles.header_section}>
      <Menu className={styles.menu_icon}/>

      <h2 className={styles.header_title}>WMS Cartelas</h2>
    </section>
  )
}

export default Header