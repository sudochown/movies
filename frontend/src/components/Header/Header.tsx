import React, { FC, useCallback, useState } from 'react';
import styles from './header.module.scss';

import profileIcon from '../../assets/images/profile.png';
import { logOut } from '../../store/auth/reducer';
import { NavigateFunction } from 'react-router-dom';
import Button from '../Button';
import { Dispatch } from '@reduxjs/toolkit';

interface HeaderProps {
  email: string;
  navigate: NavigateFunction;
  dispatch: Dispatch
}

const Header: FC<HeaderProps> = ({ dispatch, email, navigate }) => {
    const [showMenu, setShowMenu] = useState(false);

    const authenticate = useCallback<() => void>(() => {
        navigate('/auth', { replace: true });
        setShowMenu(false);
    }, [navigate]);

    const logout = useCallback<() => void>(() => {
        dispatch(logOut());
        setShowMenu(false);
    }, [dispatch]);

    return (
        <header className={styles.header}>
            <div className={styles.mainBlock}>
                <h1>Movies App</h1>
            </div>
            <div className={styles.navIcons} onClick={() => setShowMenu(!showMenu)}>
                {email
                    ? <span className={styles.profileLetter}>{email.charAt(0)}</span>
                    : <img src={profileIcon} alt={'profileIcon'} className={styles.profileIcon} />
                }
                {showMenu && (
                    <div className={styles.dropdown}>
                        {!email ? (
                            <Button onClick={authenticate} text="SignIn/SignUp" />
                        ) : (
                            <Button onClick={logout} text="Log out" />
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
