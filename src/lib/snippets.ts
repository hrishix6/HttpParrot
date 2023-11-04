import { FormDataItem, HeaderItem, SupportedSnippetLang } from '@/common/types';
import { RequestSectionState } from '../components/domain/request.section/redux/request.section.reducer';

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

function toCurlSnippetData(model: RequestSectionState): SnippetData {
  return {
    url: model.url,
    method: model.method.toUpperCase(),
    json: "{'x':'y'}",
    headers: model.headers.filter((x) => x.enabled)
  };
}

function toFetchSnippetData(model: RequestSectionState): SnippetData {
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
  model: RequestSectionState,
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
  model: RequestSectionState,
  lang: SupportedSnippetLang
) {
  const data = toSnippetData(model, lang);
  console.log(data);
  return "";
}
