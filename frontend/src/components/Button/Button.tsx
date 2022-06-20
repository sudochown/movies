import React, { ReactNode } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
}

interface ButtonProps {
  variant?: ButtonVariant;
  text: string | ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
    variant,
    text,
    onClick,
}: ButtonProps) => (
    <button
        className={classNames(
            styles.buttonContainer,
            variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary
        )}
        onClick={onClick}
    >
        {text}
    </button>
);

Button.defaultProps = {
    variant: ButtonVariant.primary,
};

export default Button;
