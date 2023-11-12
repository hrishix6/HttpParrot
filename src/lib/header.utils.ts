import { HeaderItem, InsertEditableItem, RequestAuthConfig, ResponseHeader, SupportedBodyType } from "@/common/types";
import { substituteText } from "./text.utils";

export function toFetchHeaders(headers: HeaderItem[]): Record<string, any> {
    const fetchHeaders: Record<string, any> = {};

    for (let h of headers.filter(x => x.enabled)) {
        if (h.name) {
            fetchHeaders[h.name] = h.value;
        }
    }
    return fetchHeaders;
}

export function toSubstitutedFetchHeaders(headers: HeaderItem[], map: Record<string, string>) {
    const fetchHeaders: Record<string, any> = {};
    let k, v = "";
    for (let h of headers.filter(x => x.enabled)) {
        if (h.name) {
            k = substituteText(h.name, map);
            v = substituteText(h.value, map);
            fetchHeaders[k] = v;
        }
    }
    return fetchHeaders;
}

export function toAuthHeader(authConfig: RequestAuthConfig): InsertEditableItem | null {
    switch (authConfig.authType) {
        case "none":
            return null;
        case "basic":
            return toBasicAuthHeader(authConfig.basicUsername, authConfig.basicPassword);
        case "token":
            return toTokenAuthHeader(authConfig.tokenPrefix, authConfig.tokenVal);
        default:
            return null
    }
}

export function toTokenAuthHeader(prefix: string = "", token: string = ""): InsertEditableItem {
    return {
        name: 'Authorization',
        value: `${prefix} ${token}`
    };
}

export function toSubstitutedTokenAuthHeader(prefix: string = "", token: string = "", map: Record<string, string>): InsertEditableItem {
    return {
        name: 'Authorization',
        value: `${substituteText(prefix, map)} ${substituteText(token, map)}`
    }
}

export function toBasicAuthHeader(username: string = "", password: string = ""): InsertEditableItem {
    return {
        name: 'Authorization',
        value: `Basic ${btoa(`${username}:${password}`)}`
    };
}

export function toSubstitutedBasicAuthHeader(username: string = "", password: string = "", map: Record<string, string>): InsertEditableItem {

    const subbedUsername = substituteText(username, map);
    const subbedPass = substituteText(password, map);

    const encoded = btoa(`${subbedUsername}:${subbedPass}`);

    return {
        name: 'Authorization',
        value: `Basic ${encoded}`
    }
}

export function toSubstitutedAuthHeader(authConfig: RequestAuthConfig, map: Record<string, string>): InsertEditableItem | null {
    switch (authConfig.authType) {
        case "none":
            return null;
        case "basic":
            return toSubstitutedBasicAuthHeader(authConfig.basicUsername, authConfig.basicPassword, map);
        case "token":
            return toSubstitutedTokenAuthHeader(authConfig.tokenPrefix, authConfig.tokenVal, map);
        default:
            return null
    }
}

export function toResponseHeaders(headers: Headers): ResponseHeader[] {
    const responseheaders: ResponseHeader[] = [];

    for (let [resKey, resVal] of headers.entries()) {
        responseheaders.push({ name: resKey, value: resVal });
    }
    return responseheaders;
}

export const getContentTypeHeader = (bodyType: SupportedBodyType): string => {
    switch (bodyType) {
        case "formdata":
            return "multipart/form-data";
        case "json":
            return "application/json";
        case "text":
            return "text/plain";
        case "xml":
            return "application/xml";
        case "url_encoded":
            return "application/x-www-form-urlencoded"
        default:
            return "text/plain";
    }
}