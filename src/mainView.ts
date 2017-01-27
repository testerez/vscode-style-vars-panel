import { diff, filterSort, isColor, isDimen, parseColor, parseDimen } from './util';
import { map, chain } from 'lodash';
require("string_score");

function renderCSS() {
  return `
    * {
      box-sizing: border-box;
      line-height: 1.2;
    }
    label{
      cursor: pointer;
    }
    body {
      color: #fff;
      font-size: 12px;
      font-family: Menlo, monaco, Consolas;
      padding: 0 15px 0 0;
      max-width: 100%;
    }
    .h2 {
      font-weight:bold;
      text-transform: uppercase;
      font-size: 12px;
      display: block;
      margin: 20px 0;
    }
    .var{
      padding: 10px 20px;
      display: block;
      text-decoration: none;
      color: inherit;
      outline: none !important;
      background: #111;
    }
    .var:not(.color){
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .var:not(.color):first-child{
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .var>span{
      padding: 3px 7px;border-radius: 3px;
      white-space: nowrap;
      max-width: 100%;
      text-overflow: ellipsis;
      display: inline-block;
      overflow: hidden;
    }
    .var.color>span{
      background: rgba(0, 0, 0 , 0.4);
    }
    .var.color:hover:not(:active)>span{
      background: rgba(0, 0, 0 , 0.5);
      box-shadow: 0 0 1px rgba(255, 255, 255 , 0.5);
    }
    .var:hover:not(:active):not(.color){
      background: #0c0c0c;
    }
    .var-value{
      color: #eee;
    }
    .matching-colors{
      padding: 20px;
      background: black;
    }
    section{
      margin-bottom: 40px;
      display: block;
    }
    .info{
      font-weight: normal;
      font-style: italic;
      font-size: 12px;
    }
    .selected-val{
      text-transform: none;
      background: rgba(255, 255, 255, 0.1);
      padding: 3px 7px;
      border-radius: 3px;
      display: inline-block;
    }


    .toggle-box {
      display: none;
    }
    .toggle-box + label + * {
      display: none;
    }
    .toggle-box:checked + label + * {
      display: block;
    }
    .toggle-box + label:after {
      content: "◢";
      margin-left: 10px;
      opacity: 0.2;
      display: inline-block;
      transform: rotate(-45deg);
    }
    .toggle-box:checked + label:after {
      transform: none;
    }
  `;
}

function getSetVarUri(varName: string) {
  return encodeURI('command:extension.insertVar?' + JSON.stringify({
    name: varName,
  }));
}

function renderVarList(vars: StyleVar[]) {
  return vars.map(({k, v, isColor}) => (`
    <a class="var ${isColor ? 'color' : ''}" style="${isColor ? `background:${v}` : ''}" href="${getSetVarUri(k)}">
      <span><b>${k}</b>: <span class="var-value">${v}</span></span>
    </a>
  `)).join('\n');
}

function getMatchingVars(selectedValue: string, vars: StyleVar[]) {
  const parsedColor = parseColor(selectedValue);
  if (parsedColor) {
    return chain(vars)
      .filter(o => o.isColor)
      .map(o => [o, diff(parseColor(o.v)!, parsedColor)])
      .filter(p => p[1] < 17)
      .sortBy(p => p[1])
      .map(p => p[0])
      .value() as StyleVar[];
  } else if (isDimen(selectedValue)) {
    const dimen = parseDimen(selectedValue)!;
    return filterSort(vars, o => {
      const d2 = parseDimen(o.v);
      if (!d2) {
        return false;
      }
      const diff = Math.abs(dimen.value - d2.value);
      return {
        keep: dimen.unit === d2.unit && diff < dimen.value * 0.2,
        sortValue: diff,
      }
    });
  } else if (selectedValue.startsWith('$')) {
    return filterSort(vars, o => {
      const score = o.k.score(selectedValue.substr(1));
      return {
        keep: score > 0,
        sortValue: score * -1
      }
    });
  }

  //general search
  return vars.filter(o =>
    `${o.k}: ${o.v}`.toLowerCase().indexOf(selectedValue.toLowerCase()) >= 0
  );
}

function renderSelectionSection(selectedValue: string, vars: StyleVar[]) {
  const matches = getMatchingVars(selectedValue, vars).slice(0, 10);
  const isC = isColor(selectedValue);
  const styles = isC ? `background: ${selectedValue}` : '';
  return `
    ${renderSectionTitle(`Matches for <span class="selected-val">${selectedValue}</span>`, 'selected')}
    <section class="${isC ? 'matching-colors' : ''}" style="${styles}">
      ${matches.length
        ? renderVarList(matches)
        : '<div class="var info"><span>No match found...<span></div>'
      }
    </section>
    `;
}

interface StyleVar {
  k: string,
  v: string,
  isColor: boolean,
  isDimen: boolean,
  isMq: boolean,
};

function renderSectionTitle(title: string, id: string) {
  return `
    <input
      class="toggle-box"
      id="${id}"
      type="checkbox"
      checked
    />
    <label class="h2" for="${id}">${title}</label>
  `;
}

function renderSection(title: string, content: string) {
  if (!content) {
    return '';
  }
  return [
    title && renderSectionTitle(title, title.replace(/ /g, '_')),
    content && `<section>${content}</section>`,
  ].filter(s => s).join('\n');
}

function renderJS() {
  return `
    <script>
      window.state = window.state || {
        collapsed: {},
      };

      console.log(JSON.stringify(state, null, 2));
      document.querySelectorAll('[type=checkbox]').forEach(e => {
        e.checked = !state.collapsed[e.id];
        e.addEventListener('change', () => {
          state.collapsed[e.id] = !e.checked;
        });
      })
    </script>
  `;
}

export function getHTML(selectedVal: string | null, varsMap: {}) {
  if (selectedVal && selectedVal.length < 2) {
    selectedVal = null;
  }
  const vars = map(varsMap, (v, k) => (typeof(v) === 'string' && {
    k,
    v,
    isColor: isColor(v),
    isDimen: isDimen(v),
    isMq: /screen and \(.+\)$/.test(v),
  })).filter(o => o) as StyleVar[];
    
  return `
    <style>${renderCSS()}</style>
    <body>
        ${ selectedVal
          ? renderSelectionSection(selectedVal, vars)
          : ''
        }

        ${renderSection(
          'Colors',
          renderVarList(vars.filter(o => o.isColor))
        )}
        ${renderSection(
          'Dimentions',
          renderVarList(vars.filter(o => o.isDimen))
        )}
        ${renderSection(
          'Media queries',
          renderVarList(vars.filter(o => o.isMq))
        )}
        ${renderSection(
          'Other variables',
          renderVarList(vars.filter(o => !o.isColor && !o.isDimen && !o.isMq))
        )}

        ${renderJS()}
    </body>
  `;
}

