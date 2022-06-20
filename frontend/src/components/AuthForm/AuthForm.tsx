import React, { useState } from 'react';
import classes from './authForm.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';

interface AuthFormProps {
  loading: boolean;
  onSubmitCallback?: (data: FormData) => void;
}

export type FormData = {
  email: string,
  password: string,
  passwordRepeat?: string,
};

const AuthForm: React.FC<AuthFormProps> = ({loading, onSubmitCallback}: AuthFormProps) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const {register, handleSubmit, formState: {errors}, getValues} = useForm<FormData>();
    const onSubmit: SubmitHandler<FormData> = data => {
        onSubmitCallback?.(data);
    };
  
    return (
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.authNav}>
                <div className={(isSignIn && classes.active) || ''} onClick={() => setIsSignIn(true)}>
          Sign In
                </div>
                <div className={(!isSignIn && classes.active) || ''} onClick={() => setIsSignIn(false)}>
          Create Account
                </div>
            </div>
            <div className={classes.inputAuthData}>
                <div className={classes.inputContainer}>
                    <label htmlFor="email">
                        <b>Email</b>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        id="email"
                        {...register('email', {
                            required: 'Email is required',
                            disabled: loading,
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please enter a valid email',
                            }
                        })}
                    />
                    <span className={classes.validationError}>{errors?.email?.message || null}</span>
                </div>
        
                <div className={classes.inputContainer}>
                    <label htmlFor="password">
                        <b>Password</b>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        id="password"
                        {...register('password', {
                            required: 'Password is required',
                            disabled: loading,
                            minLength: {
                                value: 8,
                                message: 'Password must have at least 8 characters'
                            }
                        })}
                    />
                    <span className={classes.validationError}>{errors?.password?.message || null}</span>
                </div>
        
                {!isSignIn && <div className={classes.inputContainer}>
                    <label htmlFor="passwordRepeat">
                        <b>Repeat Password</b>
                    </label>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        id="passwordRepeat"
                        {...register('passwordRepeat', {
                            required: 'Repeat password is required',
                            disabled: loading,
                            minLength: {
                                value: 8,
                                message: 'Password must have at least 8 characters'
                            },
                            validate: (value) => {
                                const {password} = getValues();
                                return password === value || 'Passwords should match!';
                            }
                        })}
                    />
                    <span className={classes.validationError}>{errors?.passwordRepeat?.message || null}</span>
                </div>}
                <button disabled={loading} type="submit"
                    className={classes.button}>{`${!isSignIn ? 'Sign Un' : 'Sign In'}`}</button>
            </div>
        </form>
    );
};

export default AuthForm;
