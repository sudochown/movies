import React, { useCallback, useEffect } from 'react';
import styles from './authPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/use-redux';
import { SLICE_USERS_NAME, signIn, signUp } from '../../store/auth/reducer';
import { useNavigate } from 'react-router-dom';
import AuthForm, { FormData } from '../../components/AuthForm';

const AuthPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentUser, loading } = useAppSelector((store) => store[SLICE_USERS_NAME]);

    const authHandler = useCallback((data: FormData) => {
        const action = !data?.passwordRepeat ? signIn : signUp;
        dispatch(action(data));
    }, [dispatch]);

    useEffect(() => {
        if (currentUser?.email) {
            navigate('/movies', { replace: true });
        }
    }, [currentUser?.email, navigate]);

    return (
        <div className={styles.container}>
            <AuthForm loading={loading} onSubmitCallback={authHandler}/>
        </div>
    );
};

export default AuthPage;
