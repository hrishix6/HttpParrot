import { RootState } from "../common/store";
import { toAuthHeader, toFetchHeaders, toSubstitutedAuthHeader, toSubstitutedFetchHeaders } from "./header.utils";
import { toSimpleFetchBody, totSubstitutedFetchBody } from "./body.utils";
import { substituteText } from "./text.utils";

interface FetchConfig {
    url: string;
    method: string;
    headers: Record<string, any>
    body?: any
}

function getSimpleConfig(state: RootState, tabId: string): FetchConfig {
    const { url, method, headers, authConfig } = state.tabsStore.tabData[tabId];

    const fetchHeaders = toFetchHeaders(headers);
    const authHeader = toAuthHeader(authConfig);

    if (authHeader) {
        fetchHeaders[authHeader.name] = authHeader.value;
    }

    return {
        url,
        method,
        headers: fetchHeaders,
        ...(method !== "get" ? { body: toSimpleFetchBody(state, tabId) } : {})
    };
}

function getSubstitutedConfig(state: RootState, tabId: string): FetchConfig {
    const { collectionId, url, method, headers, authConfig } = state.tabsStore.tabData[tabId];
    const { collections } = state.savedRequestsStore;
    const collectionVariables = collections.find(x => x.id === collectionId)?.variables || [];

    const variableMap: Record<string, string> = {};
    for (let variable of collectionVariables) {
        if (variable.name) {
            variableMap[variable.name] = variable.value;
        }
    }
    const fetchHeaders = toSubstitutedFetchHeaders(headers, variableMap);
    const authHeader = toSubstitutedAuthHeader(authConfig, variableMap);

    if (authHeader) {
        fetchHeaders[authHeader.name] = authHeader.value;
    }

    return {
        url: substituteText(url, variableMap),
        method,
        headers: fetchHeaders,
        ...(method !== "get" ? { body: totSubstitutedFetchBody(state, variableMap, tabId) } : {})
    };
}

export function toFetchConfig(state: RootState, tabId: string) {

    const { collectionId } = state.tabsStore.tabData[tabId];
    const shouldSubstitute = !!(collectionId);

    if (shouldSubstitute) {
        return getSubstitutedConfig(state, tabId);
    }

    return getSimpleConfig(state, tabId);
}
