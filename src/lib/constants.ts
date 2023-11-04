import { HeaderItem } from "@/common/types";

export const BEAUTIFY_OPTIONS = {
    indent_size: 4,
    html: {
        end_with_newline: true,
        js: {
            indent_size: 2
        },
        css: {
            indent_size: 2
        }
    },
    css: {
        indent_size: 1
    },
    js: {
        'preserve-newlines': true
    }
};

export const XML_BEATIFY_OPTIONS = {
    indentation: '  ',
    collapseContent: true,
    lineSeparator: '\n'
};

export const SUPPORTED_TEXT_FORMATS = ["js", "json", "css", "html", "xml"];

export const PRISM_SUPPORTED_CSS_LANG = ['js', 'css', 'html', 'xml'];

export const DEFAULT_MIMETYPE = "application/octet-stream";

export const DEFAULT_FILE_EXTENSION = "unknown";

export const DEFAULT_FILE_NAME = "HttpParrot_file";

export const DEFAULT_HEADERS: HeaderItem[] = [
    {
        id: '-1',
        enabled: true,
        name: 'Content-Type',
        value: 'included at runtime'
    },
    {
        id: '-2',
        enabled: true,
        name: 'Content-Length',
        value: 'included at runtime'
    },
    {
        id: '-3',
        enabled: true,
        name: 'Accept',
        value: '*/*'
    },
    {
        id: '-4',
        enabled: true,
        name: 'User-Agent',
        value: 'hrishix6/HttpParrot'
    }
];

export const APP_NAME = "HttpParrot";

export const APP_GITHUB_LINK = 'https://github.com/hrishix6/HttpParrot';

export const PROFILE_LINK = "https://github.com/hrishix6";

export const PROFILE_NAME = "hrishix6";

export const THEME_LOCAL_STORAGE_KEY = 'app-theme';

