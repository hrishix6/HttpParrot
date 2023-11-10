import { QueryItem } from "@/common/types";
import { v4 as uuidv4 } from "uuid";


export function getQueryString(items: QueryItem[]) {
    const enabledItems = items.filter(x => x.enabled && x.name && x.value);
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
