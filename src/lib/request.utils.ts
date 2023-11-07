import { RootState } from "../common/store";
import { toFetchHeaders, toSubstitutedFetchHeaders } from "./header.utils";
import { toSimpleFetchBody, totSubstitutedFetchBody } from "./body.utils";
import { substituteText } from "./text.utils";

interface FetchConfig {
    url: string;
    method: string;
    headers: Record<string, any>
    body?: any
}

function getSimpleConfig(state: RootState, tabId: string): FetchConfig {
    const { url, method, headers } = state.tabsStore.tabData[tabId];
    return {
        url,
        method,
        headers: toFetchHeaders(headers),
        ...(method !== "get" ? { body: toSimpleFetchBody(state, tabId) } : {})
    };
}

function getSubstitutedConfig(state: RootState, tabId: string): FetchConfig {
    const { collectionId, url, method, headers } = state.tabsStore.tabData[tabId];
    const { collections } = state.savedRequestsStore;
    const collectionVariables = collections.find(x => x.id === collectionId)?.variables || [];

    const variableMap: Record<string, string> = {};
    for (let variable of collectionVariables) {
        if (variable.name) {
            variableMap[variable.name] = variable.value;
        }
    }
    return {
        url: substituteText(url, variableMap),
        method,
        headers: toSubstitutedFetchHeaders(headers, variableMap),
        ...(method !== "get" ? { body: totSubstitutedFetchBody(state, variableMap, tabId) } : {})
    };
}

export function toFetchConfig(state: RootState, tabId: string) {

    const { collectionId, collectionName } = state.tabsStore.tabData[tabId];
    const shouldSubstitute = !!(collectionId && collectionName);

    if (shouldSubstitute) {
        return getSubstitutedConfig(state, tabId);
    }

    return getSimpleConfig(state, tabId);
}
