import { BodyConfig, FormDataItem, HeaderItem, QueryItem, SupportedBodyType } from "@/common/types";
import { v4 as uuidv4 } from "uuid";
import { substituteURL } from "@/lib/utils";

//URL===================================================================================

export function getQueryString(items: QueryItem[]) {

    const enabledItems = items.filter(x => x.enabled);
    if (enabledItems.length) {
        const queryString = enabledItems.map(item => {
            const { name: key, value } = item;
            const encodedKey = encodeURIComponent(key).replace(/%7B/g, '{').replace(/%7D/g, '}');
            const encodedValue = encodeURIComponent(value).replace(/%7B/g, '{').replace(/%7D/g, '}');
            return `${encodedKey}=${encodedValue}`;
        }).join('&');

        return `${queryString}`;
    }

    return "";
}

export const getQueryItems = (queryString: string): QueryItem[] => {

    const queryItems: QueryItem[] = [];
    if (queryString) {
        const params = new URLSearchParams(queryString);
        for (let p of params) {
            const [key, value] = p;
            queryItems.push({
                id: uuidv4(),
                name: key,
                value,
                enabled: true
            })
        }
    }

    return queryItems;
};

export const getUpdatedUrl = (url: string, queryStr: string) => {
    const baeUrl = url?.split("?")[0] || "";
    if (queryStr) {
        return `${baeUrl}?${queryStr}`;
    }
    return baeUrl;
}

//Body===================================================================================

export const getBody = (bodyConfig: BodyConfig): any => {
    const { bodyType, bodyTextEnabled, bodyText, formItems } = bodyConfig;
    switch (bodyType) {
        case "formdata":
            return toFormDataBody(formItems || []);
        case "url_encoded":
            return toUrlEncodedBody(formItems || []);
        case "json":
        case "text":
        case "xml":
            return toTextBody(bodyText, bodyTextEnabled);
    }
}

export const getBodyWithVariables = (bodyConfig: BodyConfig, varMap: Record<string, string>): any => {
    const { bodyType, bodyTextEnabled, bodyText, formItems } = bodyConfig;
    switch (bodyType) {
        case "formdata":
            return toSubstitutedFormDataBody(formItems || [], varMap);
        case "url_encoded":
            return toSubstitudedUrlEncodedBody(formItems || [], varMap);
        case "json":
        case "text":
        case "xml":
            return toTextBody(bodyText, bodyTextEnabled);
    }
}

function toFormDataBody(formItems: FormDataItem[]): FormData {
    const formData = new FormData();
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                formData.append(item.name, item.value);
            }
        }
    }
    return formData;
}

function toSubstitutedFormDataBody(formItems: FormDataItem[], varMap: Record<string, string>): FormData {
    const formData = new FormData();
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                const k = substituteURL(item.name, varMap);
                const v = substituteURL(item.value, varMap);
                formData.append(k, v);
            }
        }
    }
    return formData;
}

function toSubstitudedUrlEncodedBody(formItems: FormDataItem[], varMap: Record<string, string>) {
    const data: Record<string, any> = {};
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                const k = substituteURL(item.name, varMap);
                const v = substituteURL(item.value, varMap);
                data[k] = v;
            }

        }
    }

    return new URLSearchParams(data).toString();
}

function toUrlEncodedBody(formItems: FormDataItem[]): string {
    const data: Record<string, any> = {};
    for (let item of formItems) {
        if (item.enabled) {
            if (item.name) {
                data[item.name] = item.value;
            }

        }
    }

    return new URLSearchParams(data).toString();
}

function toTextBody(bodyText: string = "", enabled: boolean = true): string {
    if (enabled) {
        return bodyText;
    }
    return "";
}

export const getContentType = (bodyType: SupportedBodyType): string => {
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

//======================================= headers ===============================================================

export function getHeaders(headers: HeaderItem[]): Record<string, any> {
    const fetchHeaders: Record<string, any> = {};
    for (const h of headers) {
        if (h.enabled) {
            if (h.name && h.value) {
                fetchHeaders[h.name.toLocaleLowerCase()] = h.value;
            }
        }
    }
    return fetchHeaders;
}

export function getHeadersWithVariables(headers: HeaderItem[], varMap: Record<string, string>): Record<string, any> {
    const fetchHeaders: Record<string, any> = {};
    for (const h of headers) {
        if (h.enabled) {
            if (h.name && h.value) {
                const k = substituteURL(h.name, varMap);
                const v = substituteURL(h.value, varMap);
                fetchHeaders[k.toLocaleLowerCase()] = v;
            }
        }
    }
    return fetchHeaders;
}