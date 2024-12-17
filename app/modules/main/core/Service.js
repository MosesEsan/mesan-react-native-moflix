import axios from 'axios';
import { CRUD_API_URL, TMDB_API_TOKEN, SECTIONS_ENDPOINT, PANELS_ENDPOINT, TMDB_API_URL, DISCOVER_ENDPOINT, SEARCH_ENDPOINT, PERSON_ENDPOINT } from './Config';

export const HEADERS = {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_TOKEN}`
    }
}
// =============================================================================================
// HELPER FUNCTIONS
// =============================================================================================
export async function apiCall(url, params={}, headers={}) {
    try {
        url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, headers);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}

// =============================================================================================
// CRUD OPERATIONS
// =============================================================================================
// OTHER CRUD OPERATIONS
// READ CONTENT - GET DETAILS
export async function getDetails(type, id, params) {
    return await apiCall(`${TMDB_API_URL}${type}/${id}`, params, HEADERS);
}

// ===============================================================================================
// PANELS ENDPOINTS
// ===============================================================================================
// Get the Sections List
export async function getSections() {
    return await apiCall(`${CRUD_API_URL}${SECTIONS_ENDPOINT}`);
}

// Get Section Panels
export async function getPanels(params = {}) {
    return await apiCall(`${CRUD_API_URL}${SECTIONS_ENDPOINT}${params['section_id']}/${PANELS_ENDPOINT}`);
}

// Get Panel Data
export async function getPanel(id, params = {}) {
    return await apiCall(`${CRUD_API_URL}${PANELS_ENDPOINT}${id}`, params);
}

// ==========================================================================================
// CATEGORY ENDPOINTS
// ==========================================================================================
// GET CATEGORIES - INDEX
export async function getCategories(section, params) {
    return await apiCall(`${TMDB_API_URL}genre/${section}/list`, params, HEADERS);
}

export async function getAllCategories() {
    const urls =  [
        axios.get(`${TMDB_API_URL}genre/movie/list`, HEADERS),
        axios.get(`${TMDB_API_URL}genre/tv/list`, HEADERS),
    ];
    try {
        let response = {};
        const res = await axios.all(urls);
        res.forEach((result, idx) => {
            let key  = idx === 0 ? 'movie' : 'tv';
            response[key] = result.data.genres.map(item => ({...item, media_type: key}));
        });
        return response;
    } catch (e) {
        throw new Error(e);
    }
}

// GET CATEGORY DATA - READ
export async function getByCategory(section, params) {
    return await apiCall(`${TMDB_API_URL}${DISCOVER_ENDPOINT}/${section}`, params, HEADERS);
}

// ==========================================================================================
// EPISODES ENDPOINTS
// ==========================================================================================
// GET SEASON EPISODES
export async function getSeasonEpisodes(series_id, season_number, params = {}) {
    return apiCall(`${TMDB_API_URL}tv/${series_id}/season/${season_number}`, params, HEADERS);
}

// ==========================================================================================
// CREDITS
// ==========================================================================================
// GET MEDIA CREDITS
export async function getCredits(section, id, params = {}) {
    let endpoint = section === 'tv' ? 'aggregate_credits' : 'credits';
    return apiCall(`${TMDB_API_URL}${section}/${id}/${endpoint}`, params, HEADERS);
}

// ==========================================================================================
// SEARCH ENDPOINT
// ==========================================================================================
// SEARCH BY NAME
export async function searchByName(mediaType='multi', params) {
    return apiCall(`${TMDB_API_URL}${SEARCH_ENDPOINT}${mediaType}`, params, HEADERS);
}

// ==========================================================================================
// PEOOPLE ENDPOINT
// ==========================================================================================
// GET PERSON INFO
export async function getPersonDetails(person_id, params) {
    return apiCall(`${TMDB_API_URL}${PERSON_ENDPOINT}${person_id}`, params, HEADERS);
}