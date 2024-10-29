import axios from 'axios';

import { sections, getUrls} from '../data/sections';

const API_URL = 'https://api.themoviedb.org/3/'
const DISCOVER_ENDPOINT = 'discover/'
const FIND_ENDPOINT = 'movie/'
const SEARCH_ENDPOINT = 'search/'

export const HEADERS = {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhM2UzYTFkNzkyMzVhMWVmMTg5ZGJiMGMyNDNmMjQwZSIsIm5iZiI6MTcyNjAxMTkzNS4zMTY3ODUsInN1YiI6IjU2MDJkMDc0YzNhMzY4NTU0MTAwMjE5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j0uqlo6JAwjS1dKZoakPNgls0R1g1kCA5gwmWhmH3mw`
    }
}
// =============================================================================================
// HELPER FUNCTIONS
// =============================================================================================
export async function apiCall(url, params, headers={}) {
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
// GET ALL DATA - INDEX
export async function getAll(params = {language: 'en-US'}) {
    // return apiCall(`${API_URL}${FIND_ENDPOINT}/912649/videos`, params, HEADERS);
}

// OTHER CRUD OPERATIONS
// READ CONTENT - GET DETAILS
export async function getDetails(type, id, params) {
    return apiCall(`${API_URL}${type}/${id}`, params, HEADERS);
}

// ===============================================================================================
// PANELS ENDPOINTS
// ===============================================================================================
// Get the Sections List
export async function getSections() {
    // return apiCall(`${API_URL}${SECTIONS_ENDPOINT}`, params, HEADERS);
    try {
        return { sections };
    } catch (e) {
        throw new Error(e);
    }
}

// Get Section Panels
export async function getDashboard(params = {}) {
    try {
        let endpoints = getUrls(params['section']);
        const urls = endpoints.map(({ url }) => axios.get(url, HEADERS));

        // let res = await axios.get(`${API_URL}${SECTIONS_ENDPOINT}/${params['id']}`);
        let res = await axios.all(urls);
        let panels = [];
        res.map((result, idx) => {
            let panel = { ...endpoints[idx] };    
            let data = result.data.genres || result.data.results || [];
    
            // If it is ther first (Trending), use the first item a the Hero item and the rest fopr the carousel
            if (idx === 1) {
                panels.unshift({ id:0, type:"showcase", item_type:"showcase", data: data[0] })
                data = data.slice(1)
            }
            panel = { ...panel, data, title: panel.name };
            panels.push(panel)
        });
        return panels;
    } catch (e) {
        throw new Error(e);
    }
}

// Get Panel Data
export async function getPanel(path, params = {}) {
    return apiCall(path, params, HEADERS);
}

// ==========================================================================================
// CATEGORY ENDPOINTS
// ==========================================================================================
// GET CATEGORIES - INDEX
export async function getCategories(section, params) {
    return await apiCall(`${API_URL}genre/${section}/list`, params, HEADERS);
}

// GET CATEGORY DATA - READ
export async function getByCategory(section, params) {
    return await apiCall(`${API_URL}${DISCOVER_ENDPOINT}/${section}`, params, HEADERS);
}

// ==========================================================================================
// EPISODES ENDPOINTS
// ==========================================================================================
// GET SEASON EPISODES
export async function getSeasonEpisodes(series_id, season_number, params = {}) {
    return apiCall(`${API_URL}tv/${series_id}/season/${season_number}`, params, HEADERS);
}

// ==========================================================================================
// CREDITS
// ==========================================================================================
// GET MEDIA CREDITS
export async function getCredits(section, id, params = {}) {
    return apiCall(`${API_URL}${section}/${id}/credits`, params, HEADERS);
}

// ==========================================================================================
// SEARCH ENDPOINT
// ==========================================================================================
// SEARCH BY NAME
export async function searchByName(mediaType='multi', params) {
    return apiCall(`${API_URL}${SEARCH_ENDPOINT}${mediaType}`, params, HEADERS);
}