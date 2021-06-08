import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
import {useRouter, userRouter} from 'next/router'
import css from './main-navigation.module.css';
import {ExpandMore, Dashboard, AccountCircle, ExitToApp} from '@material-ui/icons'

export default function MainNavigation() {
  const router = useRouter();
  const currentRoute = router.pathname
  const [session, loading] = useSession();
  function logoutHandler() {
    signOut();
    return router.push('/auth')
  }

  return (
    <div className={css.headerContainer} style={currentRoute==='/'||currentRoute==='/auth'?{backgroundColor:'transparent'}:{backgroundColor:'#001d30'}}>
      <header className={css.header}>
        <Link href='/'>
          <a>
            <div className={css.logo} style={currentRoute.includes('/dashboard')||currentRoute.includes('/files')?{marginLeft:'20px'}:{marginLeft:'0'}}><span>Chat App</span></div>
          </a>
        </Link>
        <nav>
          <ul>
            {!session && !loading && ( 
              <Link href='/auth'>
                <li className={css.loginButton}>Login</li>
              </Link> 
            )}
            {session && (
              <div className={css.navOptionRow}>
                <li>
                  <Link href='/'>Home</Link>
                </li>
                {/* <li>
                  <Link href='/user/editprofile'>{session.user.name}</Link>
                </li> */}
                <li>
                  <button onClick={logoutHandler}>Logout</button>
                </li>
              </div>
            )}
            {session && (
              <div className={css.navOptionColumn}>
                <label htmlFor="dropdown-checker" className={css.dropdownbtn}>
                  <ExpandMore fontSize="large"/>
                </label>
                <input type="checkbox" className={css.checker} id="dropdown-checker"/>
                <div className={css.navOptionColumnContainer}>
                  <li>
                    <Dashboard/>
                    <Link href='/'>Home</Link>
                  </li>
                  {/* <li>
                    <AccountCircle/>
                    <Link href='/user/editprofile'>{session.user.name}</Link>
                  </li> */}
                  <li>
                    <ExitToApp/>
                    <button onClick={logoutHandler}>Logout</button>
                  </li>
                </div>
              </div>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}