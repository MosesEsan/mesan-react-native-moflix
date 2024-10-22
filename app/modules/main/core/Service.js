import axios from 'axios';

import { sections, getUrls} from '../data/sections';

const API_URL = 'https://api.themoviedb.org/3/'
const DISCOVER_ENDPOINT = 'discover/'
const FIND_ENDPOINT = 'movie/'
const SEARCH_ENDPOINT = 'search/'

const HEADERS = {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhM2UzYTFkNzkyMzVhMWVmMTg5ZGJiMGMyNDNmMjQwZSIsIm5iZiI6MTcyNjAxMTkzNS4zMTY3ODUsInN1YiI6IjU2MDJkMDc0YzNhMzY4NTU0MTAwMjE5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j0uqlo6JAwjS1dKZoakPNgls0R1g1kCA5gwmWhmH3mw`
    }
}

// ===============================================================================================
// PANELS ENDPOINTS
// ===============================================================================================

// Get the Sections List
export async function getSections() {
    try {
        // let res = await axios.get(`${API_URL}${SECTIONS_ENDPOINT}`);
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
    try {
        // let url = `${API_URL}${PANEL_ENDPOINT}`
        let url = `${path}`
        if (Object.keys(params).length !== 0) url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, HEADERS);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}

// ===============================================================================================

// Get Data for a specific Category
export async function getByCategory(section, params) {
    try {
        let url = `${API_URL}${DISCOVER_ENDPOINT}${section}`
        url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, HEADERS);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}

// ===============================================================================================

// GET DETAILS
export async function getDetails(type, id, params) {
    try {
        let url = `${API_URL}${type}/${id}`
        url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, HEADERS);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}


// ===============================================================================================
// GET DETAILS
export async function getSeasonEpisodes(series_id, season_number, params = {}) {
    try {
        let url = `${API_URL}tv/${series_id}/season/${season_number}`
        url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, HEADERS);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}

// ===============================================================================================

// SEARCH
export async function searchByName(mediaType='movie', params) {
    try {
        let url = `${API_URL}${SEARCH_ENDPOINT}${mediaType}`
        url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
        let res = await axios.get(url, HEADERS);
        return res.data;
    } catch (e) {
        throw new Error(e);
    }
}
// ===============================================================================================
//  HELPER FUNCTIONS
// ===============================================================================================
function createPanels(results, endpoints, callback) {
    let panels = [];
    results.map((result, idx) => {
        let data = [];
        let panel = endpoints[idx];
        const { id, name, type, item_type, max, cta, url } = endpoints[idx];

        const responseData = result.data;
        data = responseData.genres || responseData.results || [];

        // If it is ther first (Trending), use the first item a the Hero item and the rest fopr the carousel
        if (idx === 1) {
            panels.unshift({ id:0, type:"showcase", item_type:"showcase", data: data[0] })
            data = data.slice(1)
        }
        panel['data'] = data;
        panel['title'] = name;
        panels.push(panel)
        // panels.push({ id, title:name, type, item_type, data, max, cta, url })
    });
    callback({panels})
}
