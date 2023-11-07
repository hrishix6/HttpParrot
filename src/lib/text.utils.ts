import { BEAUTIFY_OPTIONS, XML_BEATIFY_OPTIONS } from "./constants";
import xmlFormat, { XMLFormatterOptions } from "xml-formatter";
import Mustache from "mustache";

/**
 * Pretty formats text, Supported content types - js, css, html, json, xml.
 * @param str text to format.
 * @param kind content-type of text response.
 * @returns formatted text 
 */
export function formatText(
    str: string,
    kind: string,
): string {
    switch (kind) {
        case 'css':
            return css_beautify(str, BEAUTIFY_OPTIONS);
        case 'json':
        case 'js':
            return js_beautify(str, BEAUTIFY_OPTIONS);
        case 'html':
            return html_beautify(str, BEAUTIFY_OPTIONS);
        case 'xml':
            return xml_beatify(str, XML_BEATIFY_OPTIONS);
        default:
            return str;
    }
}

function xml_beatify(str: string, options: XMLFormatterOptions) {
    return xmlFormat(str, options);
}

/**
 * Replaces all instances of strings enclosed in `{{key}}` with values found in map.
 * input - Hello {{name}} , map -  {'name': 'hrishi'} , returns "Hello hrishi". By default
 * it will escape characters for html eg. '<', '>', "*", "&" etc.
 * placeholder prefixed with '&' eg. {{&variable}} will not be escaped, will be included
 * raw.
 * @param str input text
 * @param map dictionary of key-value pairs used to substitute values.
 */
export function substituteText(str: string, map: Record<string, string>) {
    return Mustache.render(str, map);
}