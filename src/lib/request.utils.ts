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

function getSimpleConfig(state: RootState): FetchConfig {
    const { url, method, headers } = state.requestStore;
    return {
        url,
        method,
        headers: toFetchHeaders(headers),
        ...(method !== "get" ? { body: toSimpleFetchBody(state) } : {})
    };
}

function getSubstitutedConfig(state: RootState): FetchConfig {
    const { collectionId, url, method, headers } = state.requestStore;
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
        ...(method !== "get" ? { body: totSubstitutedFetchBody(state, variableMap) } : {})
    };
}

export function toFetchConfig(state: RootState) {
    const { collectionId, collectionName } = state.requestStore;
    const shouldSubstitute = !!(collectionId && collectionName);

    if (shouldSubstitute) {
        return getSubstitutedConfig(state);
    }

    return getSimpleConfig(state);
}
