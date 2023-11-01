import { SupportedSnippetLang } from '@/common/types';
import { RequestSectionState } from '../components/domain/request.section/redux/request.section.reducer';

interface SnippetData {
  request?: {
    method: string;
    url: string;
    headers: { name: string; value: string }[];
    body: any;
    bodyisFormdata?: boolean;
    isPost?: boolean;
    bodyisJson?: boolean;
  };
}

function toCurlSnippetData(model: RequestSectionState): SnippetData {
  return {
    request: {
      url: model.url,
      method: model.method.toUpperCase(),
      body: "{'x':'y'}",
      headers: model.headers
        .filter((x) => x.enabled)
        .map((x) => ({ name: x.name, value: x.value }))
    }
  };
}

function toFetchSnippetData(model: RequestSectionState): SnippetData {
  return {
    request: {
      url: model.url,
      method: model.method.toUpperCase(),
      headers: model.headers
        ? model.headers
            .filter((x) => x.enabled)
            .map((x) => ({ name: x.name, value: x.value }))
        : [],
      body: '',
      bodyisJson: false
    }
  };
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

  const tmpl = Handlebars.templates[lang];

  return tmpl(data);
}
