import { FormDataItem, HeaderItem, SupportedSnippetLang, TabData } from '@/common/types';
interface SnippetData {
  method?: string;
  url?: string;
  headers?: HeaderItem[];
  formdata?: FormDataItem[];
  urlEncoded?: string;
  json?: string;
  xml?: string;
  text?: string;
}

function toCurlSnippetData(model: TabData): SnippetData {
  return {
    url: model.url,
    method: model.method.toUpperCase(),
    json: "{'x':'y'}",
    headers: model.headers.filter((x) => x.enabled)
  };
}

function toFetchSnippetData(model: TabData): SnippetData {
  return {
    url: model.url,
    method: model.method.toUpperCase(),
    headers: model.headers
      ? model.headers
        .filter((x) => x.enabled)
      : [],
    text: '',
  }
}

function toSnippetData(
  model: TabData,
  lang: SupportedSnippetLang
): SnippetData {
  switch (lang) {
    case 'js':
      return toFetchSnippetData(model);
    case 'curl':
      return toCurlSnippetData(model);
    default:
      return {};
  }
}

export function getCodeSnippet(
  model: TabData,
  lang: SupportedSnippetLang
) {
  const data = toSnippetData(model, lang);
  console.log(data);
  return "";
}
