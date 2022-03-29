import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './common/listGroup';
import MoviesTable from './moviesTable';
import Pagination from './common/pagination';
import {getGenres} from '../services/fakeGenreService';
import {paginate} from '../utils/paginate';
import _ from 'lodash';


class Movies extends Component {
    
    state = { 
        movies: [],
        genres:  [],
        currentPage: 1,
        pageSize: 4,
        sortColumn: { path: 'title', order: 'asc' }
    };

    componentDidMount() {

        const genres = [{ _id: "", name: 'All Genres' }, ...getGenres()];

        this.setState({
            movies: getMovies(),
            genres: genres
        });
    }

    handleDelete = movie => {
        const movies = this.state.movies.filter( m => m._id !== movie._id);
        this.setState({movies})
    };

    handleLike = (movie) => {
        let movies = this.state.movies;
        let selected_movie = movie;
        let index = movies.indexOf(movie);
        movies[index].liked = !selected_movie.liked;
        this.setState({movies});
    };

    handlePageChange = (page) => {
        this.setState({currentPage: page});
    };

    handleGenreSelect = genre => {
        this.setState({ selectedGenre: genre, currentPage:1 });
    };

    handleSort =  path => {
        const sortColumn = {...this.state.sortColumn};
        if(sortColumn.path === path)
            sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
        else {
            sortColumn.path = path;
            sortColumn.order = "asc";
        }
        this.setState({ sortColumn: { path, order: "asc" } });
    };

    render() { 

        const { length:count } = this.state.movies;

        const {
            pageSize, 
            currentPage, 
            sortColumn,
            selectedGenre, 
            movies:allMovies
        } = this.state;

        if(count === 0) return <p>There is no movie in the database.</p>

        const filtered = selectedGenre && selectedGenre._id? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;
        
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

        const movies = paginate(sorted, currentPage, pageSize);

        return (
            <div className='row'>
                <div className="col-3">
                    <ListGroup 
                        items={this.state.genres} 
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect}
                    />
                </div>
                <div className="col">
                    <p>Showing {filtered.length} movies from database</p>

                    <MoviesTable 
                        movies={movies} 
                        handleDelete={this.handleDelete} 
                        handleLike={this.handleLike}
                        onSort={this.handleSort}
                    />

                    <Pagination 
                        itemCount={filtered.length} 
                        pageSize={pageSize} 
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}
 
export default Movies;