const useTMDB = (item) => {
    const {
        spoken_languages = [],
        genres = [], credits = {},
        runtime = null, 
        release_date = null, 
        seasons = [],
        created_by = [],
        number_of_episodes=null,
        number_of_seasons=null,
        backdrop_path=null,
        poster_path=null,
        first_air_date = null
    } = item;
    const { crew = [] } = credits;

    // Join the spoken_languages array into a string
    let languages = spoken_languages.map(item => item.english_name).join(', ');

    // Join the genres array into a string
    let genresString = genres.map(item => item.name).join(', ');

    // Filter the crew array to get the director(s), then join them into a string
    let director = crew.filter(item => item.job === 'Director');
    director = director.map(item => item.name).join(', ');

    let creators = created_by.map(item => item.name).join(', ');

    let runtimeString = runtime ? `${runtime} mins` : null;

    let no_of_seasons = number_of_seasons ? `${number_of_seasons} Seasons` : null;
    
    const videos = item?.videos?.results?.filter(video => video.site === 'YouTube') || [];
    const cast = item?.credits?.cast || [];

    // loop throught he season add add the series_id
    seasons.map(season => season.series_id = item.id)
    return { 
        languages, genres, genresString, 
        director, creators, 
        number_of_episodes, 
        runtime:runtimeString, 
        number_of_seasons:no_of_seasons, seasons,
        backdrop_path, 
        poster_path,
        videos, cast,
        release_date,
        first_air_date
    }
}

export default useTMDB;