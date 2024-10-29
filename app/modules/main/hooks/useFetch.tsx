import {useState} from "react";

import axios from "axios";

export default function useFetch(initialData: any[]) {
    // LOADING STATES
    const [isFetching, setIsFetching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    // DATA STATES
    const [data, _setData] = useState(initialData || []);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [totalResults, setTotalResults] = useState(null);

    // ERROR STATES
    const [error, setError] = useState(null);
    
    // SET LOADING STATES
    const setLoadingState = (fetching=false, refreshing=false, fetchingMore=false) => {
        // If fetching and not refreshing or getting more, empty the data array
        if (fetching) _setData([])

        setIsFetching(fetching);
        setIsRefreshing(refreshing);
        setIsFetchingNextPage(fetchingMore);
    };

    // SET DATA STATE
    const setData = (data: any[]) => {
        _setData(data);
        setError(null);
    }

    // API REQUEST FUNCTION
    const makeAPIRequest = async (url: string, params: { [x: string]: any; }, headers={}) => {
        try {
            url = `${url}?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`;
            let res = await axios.get(url, headers);
            return res.data;
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }

    const setAPIResponse = (res: any, keys: { page: string, total: string, total_pages: string, data: string }) => {
        const _page = res?.page || res[keys?.page] || 1;
        const totalResults = res[keys?.total] || 0;
        const totalPages = res[keys?.total_pages] || 1;
        const results = res?.data || res[keys?.data] || [];
        setPage(_page)
        setTotalResults(totalResults)
        setNextPage(_page < totalPages ? _page + 1 : null)
        setData(_page > 1 ? [...data, ...results] : results);
    }

    return [
        { data, error, page, nextPage, totalResults, isFetching, isRefreshing, isFetchingNextPage }, 
        { setData, setError, setPage, setNextPage, setTotalResults, setIsFetching, setIsRefreshing, setIsFetchingNextPage, setAPIResponse, setLoadingState }
    ]
}