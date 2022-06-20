import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './aboutMovies.module.scss';
import { MovieType } from '../../types';

const AboutMovie = () => {
    const params = useParams();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const fetchMovie = useCallback(async () => {
        const res = await fetch(`http://localhost:4500/movies/${params.id}`);
        return await res.json();
    }, [params.id]);

    useEffect(() => {
        fetchMovie().then((r) => setMovie(r));
    }, [fetchMovie]);
    return (
        <div className={styles.movieBlock}>
            {movie && (
                <>
                    <img src={movie.logo} alt={movie.title} />
                    <div>
                        <h1>{movie.title}</h1>
                        <p>{movie.description}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AboutMovie;
