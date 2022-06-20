import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './movieCard.module.scss';
import { MovieType } from '../../types';

const MovieCard: FC<MovieType> = ({ genres, logo, title, year, _id }) => (
    <div className={styles.cardBlock}>
        <img src={logo} alt={title} />
        <h3>
            <Link to={`/movies/${_id}`}>{title}</Link>
        </h3>
        <p>{year}</p>
        <div>
            {genres.map((genre) => (
                <span key={genre}>{genre}&nbsp;/&nbsp;</span>
            ))}
        </div>
    </div>
);

export default MovieCard;
