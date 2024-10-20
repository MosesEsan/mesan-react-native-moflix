import axios from 'axios'; 

// 1 - PANELS
// HOME
const home = [
    {
        id: 0,
        name: "Trending Movies",
        url: "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
    {
        id: 1,
        name: "Trending TV Shows",
        url: "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
    {
        id: 2,
        name: "Popular Movies",
        url: "https://api.themoviedb.org/3/movie/popular?language=en-US",
        type: "carousel",
        item_type: "media-medium",
        max: 5,
        cta: true,
    },
    {
        id: 2,
        name: "Popular TV Shows",
        url: "https://api.themoviedb.org/3/tv/popular?language=en-US",
        type: "carousel",
        item_type: "media-large",
        max: 5,
        cta: true,
    }
];

// MOVIE
const movies = [
    {
        id: 4,
        name: "Categories",
        url: "https://api.themoviedb.org/3/genre/movie/list",
        type: "carousel",
        item_type: "category",
        max: 6,
        cta: true,
    },
    {
        id: 0,
        name: "Now Playing",
        url: "https://api.themoviedb.org/3/movie/now_playing?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 6,
        cta: true,
    },
    {
        id: 1,
        name: "Upcoming",
        url: "https://api.themoviedb.org/3/movie/upcoming?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
    {
        id: 2,
        name: "Popular",
        url: "https://api.themoviedb.org/3/movie/popular?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 6,
        cta: true,
    },
    {
        id: 3,
        name: "Top Rated",
        url: "https://api.themoviedb.org/3/movie/top_rated?language=en-US",
        type: "carousel",
        item_type: "media",
        max: 6,
        cta: true
    },
]

// TV
const tv = [
    {
        id: 4,
        name: "Categories",
        url: "https://api.themoviedb.org/3/genre/tv/list",
        type: "carousel",
        item_type: "category",
        max: 6,
        cta: true,
    },
    {
        id: 0,
        name: "Airing Today",
        url: "https://api.themoviedb.org/3/tv/airing_today",
        type: "carousel",
        item_type: "media",
        max: 6,
        cta: true,
    },
    {
        id: 1,
        name: "On The Air",
        url: "https://api.themoviedb.org/3/tv/on_the_air",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
    {
        id: 2,
        name: "Popular",
        url: "https://api.themoviedb.org/3/tv/popular",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
    {
        id: 3,
        name: "Top Rated",
        url: "https://api.themoviedb.org/3/tv/top_rated",
        type: "carousel",
        item_type: "media",
        max: 5,
        cta: true,
    },
]

// =========================================================================================

// 2 - SECTIONS
export const sections = [
    {
        id: 0,
        name: "Home",
        slug: "home",
        panels: home
    },
    {
        id: 1,
        name: "Movies",
        slug: "movie",
        panels: movies
    },
    {
        id: 2,
        name: "TV Shows",
        slug: "tv",
        panels: tv
    }
]

// 3 - GET URLS
export const getUrls = (section_id) => {
    const { panels: endpoints = [] } = sections.find(s => s.id === section_id) || {};
    return endpoints;
}

