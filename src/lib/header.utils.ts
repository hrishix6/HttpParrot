import { HeaderItem, ResponseHeader, SupportedBodyType } from "@/common/types";
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