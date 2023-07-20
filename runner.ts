import fs from 'fs';
import prettier from 'prettier/standalone';
import typescriptPlugin from 'prettier/parser-typescript';
import {Project, ts} from 'ts-morph';
import type {
  JsxExpression,
  Identifier,
  JsxAttribute,
  JsxAttributeLike,
  JsxAttributes,
  JsxAttributeValue,
  JsxOpeningElement,
  JsxSelfClosingElement,
} from 'typescript';
import {glob} from 'glob';

const project = new Project();
let replaceStyles = {
  alignSelf: 'self',
  alignItems: 'items',
  alignContent: 'content',
  justifyContent: 'justify',
  flex: 'flex',
  scale: 'scale',
  backgroundColor: 'bg',
  borderRadius: 'rounded',
  borderTopLeftRadius: 'rounded-tl',
  borderTopRightRadius: 'rounded-tr',
  borderBottomLeftRadius: 'rounded-bl',
  borderBottomRightRadius: 'rounded-br',
  width: 'w',
  height: 'h',
  top: 'top',
  left: 'left',
  right: 'right',
  bottom: 'bottom',
  padding: 'p',
  paddingTop: 'pt',
  paddingLeft: 'pl',
  paddingRight: 'pr',
  paddingBottom: 'pb',
  margin: 'm',
  marginTop: 'mt',
  marginLeft: 'ml',
  marginRight: 'mr',
  marginBottom: 'mb',
  borderWidth: 'border',
  borderTopWidth: 'border-t',
  borderLeftWidth: 'border-l',
  borderRightWidth: 'border-r',
  borderBottomWidth: 'border-b',
  border: 'border',
  borderTop: 'border-t',
  borderLeft: 'border-l',
  borderRight: 'border-r',
  borderBottom: 'border-b',
  borderColor: 'border',
  borderStyle: 'border',
  gap: 'gap',
  transform: 'transform',
  textShadow: 'shadow',
  fontSize: 'text',
  color: 'text',
  fontWeight: 'font',
  fontFamily: 'font',
  lineHeight: 'leading',
  letterSpacing: 'tracking',
  zIndex: 'z',
  opacity: 'opacity',
  overflowY: 'overflow-y',
  overflowX: 'overflow-x',
  overflow: 'overflow',
  boxShadow: 'shadow',
  minWidth: 'min-w',
  maxWidth: 'max-w',
  minHeight: 'min-h',
  maxHeight: 'max-h',
};

const lookups = {
  absolute: 'absolute',
  accordionPanel: '',
  'action-plan': '',
  'action-plan-variables': '',
  alignCenter: 'items-center',
  alignFlexEnd: 'items-end',
  alignFlexStart: 'items-start',
  'anchor-bottom': '',
  'anchor-bottom-left': '',
  'anchor-bottom-right': '',
  'anchor-left': '',
  'anchor-middle': '',
  'anchor-right': '',
  'anchor-top': '',
  'anchor-top-left': '',
  'anchor-top-right': '',
  'aspect1-1': 'aspect-square',
  'aspect16-9': 'aspect-w-16 aspect-h-9',
  'aspect2-1': 'aspect-w-2 aspect-h-1',
  backGradient: '',
  'bg-background': '',
  'bg-blue': '',
  'bg-border': '',
  'bg-darkBG': '',
  'bg-darkBlue': '',
  'bg-darkerBlue': '',
  'bg-darkerBlue2': '',
  'bg-darkerBlue3': '',
  'bg-darkRed': '',
  'bg-firstLayer': '',
  'bg-gold': '',
  'bg-highlight': '',
  'bg-input': '',
  'bg-lightBlue': '',
  'bg-mainLayer': '',
  'bg-secondLayer': '',
  'bg-white': '',
  'bg-white2': '',
  block: 'block',
  bold: 'font-bold',
  border: '',
  borderB: 'border-b-1',
  borderBlue: '',
  borderFull: '',
  borderInput: '',
  borderL: 'border-l-1',
  borderR: 'border-r-1',
  borders: '',
  borderT: 'border-t-1',
  brightenHover: '',
  brighter: '',
  button: '',
  buttonForm: '',
  center: 'justify-center items-center',
  circle: 'rounded-full',
  col: 'flex-col',
  colMobile: 'sm:flex-col',
  'color-bg': '',
  'color-black': '',
  'color-highlight': '',
  'color-icon-highlight': '',
  'color-red': '',
  'color-white': '',
  'color-white2': '',
  'color-white5': '',
  'color-white7': '',
  colorPanel: '',
  colorPanelMobile: '',
  colReversed: '',
  container: 'container',
  'crazy-cone-gradient': '',
  dangerButton: '',
  darker: '',
  debug: '',
  editButton: '',
  editorButton: '',
  editorPanel: '',
  elevation0: 'shadow-none',
  elevation1: 'shadow-sm',
  elevation2: 'shadow',
  elevation3: 'shadow-md',
  elevation4: 'shadow-lg',
  elevation5: 'shadow-xl',
  elevation6: 'shadow-2xl',
  elevation7: '',
  elevation8: 'shadow-2xl',
  elevation9: 'shadow-2xl',
  emoji: '',
  enableTouch: '',
  f0: 'flex-0',
  f1: 'flex-1',
  f2: 'flex-2',
  f4: 'flex-4',
  fBold: '',
  fColDark: '',
  fColError: '',
  fColGray: '',
  fColLight: '',
  fColPrimary: '',
  fColWhite: '',
  fg1: '',
  fHud: '',
  fixed: '',
  flex: 'flex',
  flexEnd: '',
  flexStart: '',
  fLight: '',
  flowButton: '',
  flowButtonDisabled: '',
  flowButtonText: '',
  flowContainer: '',
  flowContainerParent: '',
  flowInput: '',
  flowPillButton: '',
  flowSelectButton: '',
  flowSelectButtonDisabled: '',
  flowSelectButtonSelected: '',
  flowSite: '',
  fMonoSpace: '',
  fRegular: '',
  fRegularSite: '',
  fSBold: '',
  fSite: '',
  fSiteBody: '',
  fThin: '',
  full: 'w-full h-full',
  fullHeight: 'h-full',
  fullScreenWidth: 'w-screen',
  fullView: 'full-view',
  fullViewHeight: 'full-view-height',
  fullWidth: 'w-full',
  gameObjectTypePanel: 'game-object-type-panel',
  'gap-l': 'gap-4',
  'gap-m': 'gap-2',
  'gap-s': 'gap-1',
  'gap-xs': 'gap-0.5',
  gradient: '',
  grid1: '',
  grid2: '',
  grid3: '',
  grid4: '',
  grid5: '',
  gridAuto: '',
  halfUiGap: '',
  hidden: 'hidden',
  hollowBorder: '',
  hollowButton: '',
  homeButton: '',
  homeButtonGold: '',
  hudEditorPanel: 'hud-editor-panel',
  hudElement: '',
  hudElementNoBackground: '',
  hudPanel: 'hud-panel',
  hudProgressBar: '',
  icon: '',
  'icon-add': '',
  'icon-assets': '',
  'icon-boundingbox': '',
  'icon-color-drop-pick': '',
  'icon-config': '',
  'icon-drawings': '',
  'icon-entityTypes': '',
  'icon-events': '',
  'icon-gameconfig': '',
  'icon-map': '',
  'icon-physics': '',
  'icon-publish': '',
  'icon-sourcecontrol': '',
  'icon-tilemap': '',
  'icon-timers': '',
  'icon-variables': '',
  'inline-block': 'inline-block',
  'inline-flex': 'inline-flex',
  inlineBlock: 'inline-block',
  isolate: '',
  justifyCenter: 'justify-center',
  justifyStretch: 'justify-stretch',
  'keyboard-grid': '',
  'keyboard-grid-no-modifier': '',
  'keyboard-minus-x': '',
  'keyboard-minus-y': '',
  'keyboard-minus-z': '',
  'keyboard-plus-alt': '',
  'keyboard-plus-delete': '',
  'keyboard-plus-x': '',
  'keyboard-plus-y': '',
  'keyboard-plus-z': '',
  keyButton: '',
  keyButtonModifier: '',
  keyButtonOperation: '',
  link: '',
  'm-0': '',
  'm-auto': '',
  'm-l': '',
  'm-m': '',
  'm-s': '',
  'm-xs': '',
  mapEditorPanel: 'map-editor-panel',
  mapObjectPanel: 'map-object-panel',
  mapObjectPanelWide: 'map-object-panel-wide',
  marginAuto: 'ml-auto mr-auto',
  marginVAuto: 'mt-auto mb-auto',
  'mb-l': 'mb-6',
  'mb-m': 'mb-4',
  'mb-s': 'mb-2',
  'mb-xs': 'mb-1',
  menuItem: '',
  menuItemBig: '',
  'mh-0': 'mx-0',
  'mh-l': 'mx-6',
  'mh-m': 'mx-4',
  'mh-s': 'mx-2',
  'mh-xl': 'mx-8',
  'mh-xs': 'mx-1',
  'ml-l': 'ml-6',
  'ml-m': 'ml-4',
  'ml-s': 'ml-2',
  'ml-xs': 'ml-1',
  'mr-l': 'mr-6',
  'mr-m': 'mr-4',
  'mr-s': 'mr-2',
  'mr-xs': 'mr-1',
  'mt-l': 'mt-6',
  'mt-m': 'mt-4',
  'mt-s': 'mt-2',
  'mt-xl': 'mt-8',
  'mt-xs': 'mt-1',
  'mv-l': 'my-6',
  'mv-m': 'my-4',
  'mv-s': 'my-2',
  'mv-xs': 'my-1',
  'mv-xxs': 'my-0.5',
  noFont: '',
  noSelect: 'user-select-none',
  noTouch: 'pointer-events-none',
  objectContain: 'object-contain',
  objectCover: 'object-cover',
  onlyOneLine: 'only-one-line',
  'overflow-hidden': 'overflow-hidden',
  'overflow-y-auto': 'overflow-y-auto',
  'overflow-y-scroll': 'overflow-y-scroll',
  overflowXAuto: 'overflow-x-auto',
  overflowYAuto: 'overflow-y-auto',
  'p-0': 'p-0',
  'p-l': 'p-6',
  'p-m': 'p-4',
  'p-s': 'p-2',
  'p-xs': 'p-1',
  panel: 'panel',
  'pb-l': 'pb-6',
  'pb-m': 'pb-4',
  'pb-s': 'pb-2',
  'pb-xs': 'pb-1',
  'ph-l': 'px-6',
  'ph-m': 'px-4',
  'ph-s': 'px-2',
  'ph-xl': 'px-8',
  'ph-xs': 'px-1',
  'pl-0': 'pl-0',
  'pl-l': 'pl-6',
  'pl-m': 'pl-4',
  'pl-s': 'pl-2',
  'pl-xs': 'pl-1',
  pointer: 'cursor-pointer',
  'pointer-ew': 'cursor-ew-resize',
  'pointer-ns': 'cursor-ns-resize',
  'pr-l': 'pr-6',
  'pr-m': 'pr-4',
  'pr-s': 'pr-2',
  'pr-xs': 'pr-1',
  primaryButton: 'primary-button',
  'pt-l': '',
  'pt-m': '',
  'pt-s': '',
  'pt-xs': '',
  'pv-0': '',
  'pv-l': '',
  'pv-m': '',
  'pv-s': '',
  'pv-xl': '',
  'pv-xs': '',
  qgBorder: '',
  qgBorderButton: '',
  qgBorderButtonCustom: '',
  qgBorderButtonGold: '',
  qgBorderButtonRed: '',
  qgGameFilter: '',
  'radius-button': '',
  'radius-panel': '',
  rangeInput: '',
  rangeInputInner: '',
  'really-no-select': '',
  relative: 'relative',
  round: '',
  row: 'flex-row',
  rowMobile: 'sm:flex-row',
  selfCenter: 'self-center',
  selfEnd: 'self-end',
  selfStretch: 'self-stretch',
  simpleMenuItem: '',
  size2xl: '',
  size3xl: '',
  size4xl: '',
  size5xl: '',
  size6xl: '',
  size7xl: '',
  size8xl: '',
  size9xl: '',
  sizeBase: '',
  sizeLg: '',
  sizeSm: '',
  sizeXl: '',
  sizeXs: '',
  spaceAround: '',
  spaceBetween: '',
  spanGridColumns: '',
  spanGridRows: '',
  stretch: '',
  tabBody: '',
  tag: '',
  'text-break-word': '',
  'text-shadow': '',
  'text-shadow2': '',
  textAreaInput: '',
  textCenter: '',
  textInput: '',
  textInputBig: '',
  textInputNoWidth: '',
  textInputTall: '',
  textLeft: '',
  textRight: '',
  tintWhite: '',
  truncate: '',
  widthInitial: '',
  wrap: '',
};

function hyphenToCamelCase(escapedText: string) {
  return escapedText.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export function processFile(name: string, src: string) {
  console.log('processing', name);

  src = src.replaceAll(' ss,', ' className,');
  src = src.replaceAll(' ss?: SSType;', ' className: string;');

  const sourceFile = project.createSourceFile(name, src, {overwrite: true});
  let factory = ts.factory;
  let classIndex = 0;
  let styleIndex = 0;
  let classNodes: [any, string][] = [];
  let styleNodes: [any, string][] = [];
  // this can be done starting on any node and not just the root node
  const j = sourceFile.transform((traversal) => {
    const node = traversal.visitChildren(); // return type is `ts.Node`

    switch (node.kind) {
      case ts.SyntaxKind.JsxAttributes:
        const parent = node.parent as JsxSelfClosingElement | JsxOpeningElement;
        if (!parent) {
          return node;
        }
        const tagName = (parent.tagName as Identifier).text;
        if (!tagName) {
          //<EditorManagerContext.Provider
          return node;
        }
        if (tagName[0] === tagName[0].toUpperCase()) {
          // Class components
          return node;
        }

        const jsxNode = node as JsxAttributes;
        let properties = jsxNode.properties;
        if (
          !jsxNode.properties.some(
            (e) =>
              ((e.name as Identifier)?.escapedText as string)?.indexOf('use:ss') === 0 ||
              ((e.name as Identifier)?.escapedText as string)?.indexOf('ss') === 0
          )
        )
          return node;
        const foundProps: JsxAttributeLike[] = [];
        let classAttribute: JsxAttributeValue | null = null;
        let styleAttribute: JsxAttributeValue | null = null;
        let styleObject: string | null = null;
        for (const property of properties) {
          if (property.kind === 290) {
            foundProps.push(property);
            continue;
          }
          assertType<JsxAttribute>(property);
          let name = (property.name as Identifier)?.escapedText as string;
          if (name === 'use:ss' || name === 'ss') {
            assertType<JsxExpression>(property.initializer);

            let template = SSToTailwind(property.initializer.expression?.getText()!);
            styleObject = template.styles;
            classNodes.push([null, template.classString]);

            continue;
          } else {
            if (name === 'class') {
              classAttribute = property.initializer!;
            } else if (name === 'style') {
              styleAttribute = property.initializer!;
            } else foundProps.push(property);
          }
        }
        let classText = '';
        if (classAttribute) {
          switch (classAttribute.kind) {
            case ts.SyntaxKind.JsxExpression:
              classText = classAttribute.expression?.getText();
              break;
            case ts.SyntaxKind.StringLiteral:
              classText = classAttribute.getText();
              break;
          }
        }
        let styleText = '';
        if (styleAttribute) {
          switch (styleAttribute.kind) {
            case ts.SyntaxKind.JsxExpression:
              styleText = styleAttribute.expression?.getText();
              break;
            case ts.SyntaxKind.StringLiteral:
              styleText = styleStringToStyleObject(styleAttribute.getText());
              break;
          }
        }
        if (classText) {
          classNodes[classNodes.length - 1][1] = `clsx(${classText},${classNodes[classNodes.length - 1][1]})`;
        } else {
          debugger;
        }
        if (styleText && styleObject) {
          throw new Error('Cannot have both style and use:ss');
          /*
          let items = factory.createJsxAttribute(
            factory.createIdentifier('style'),
            factory.createStringLiteral(`${index++}`)
          );
          classNodes[classNodes.length - 1][0] = index - 1;
          foundProps.push(items);
*/
        }
        if (styleObject) {
          let items = factory.createJsxAttribute(
            factory.createIdentifier('style'),
            factory.createStringLiteral(`${styleIndex++}`)
          );
          styleNodes.push([styleIndex - 1, styleObject]);
          foundProps.push(items);
        }

        let items = factory.createJsxAttribute(
          factory.createIdentifier('class'),
          factory.createStringLiteral(`${classIndex++}`)
        );
        classNodes[classNodes.length - 1][0] = classIndex - 1;
        foundProps.push(items);
        return factory.createJsxAttributes(foundProps);
    }
    return node;
  });
  if (classNodes.length === 0) return src;

  classNodes[classNodes.length - 1][0] = classIndex - 1;
  if (styleNodes.length > 0) {
    styleNodes[styleNodes.length - 1][0] = styleIndex - 1;
  }

  for (const d of sourceFile.getDescendants()) {
    if (d.wasForgotten()) continue;
    for (const classNode of classNodes) {
      let c = classNode[0];
      if (
        d?.compilerNode?.name?.escapedText === 'class' &&
        d?.compilerNode?.initializer?.kind === ts.SyntaxKind.StringLiteral
      ) {
        if (d.compilerNode?.initializer?.text === c.toString()) {
          d.replaceWithText(`class={${classNode[1]}}`);
          break;
        }
      }
    }
    for (const styleNode of styleNodes) {
      let c = styleNode[0];
      if (
        d?.compilerNode?.name?.escapedText === 'style' &&
        d?.compilerNode?.initializer?.kind === ts.SyntaxKind.StringLiteral
      ) {
        if (d.compilerNode?.initializer?.text === c.toString()) {
          d.replaceWithText(`style={${styleNode[1]}}`);
          break;
        }
      }
    }
  }
  let fullText = j.getFullText();
  sourceFile.delete();

  let result = prettier.format(fullText, {
    parser: 'typescript',
    plugins: [typescriptPlugin, require('prettier-plugin-organize-imports'), require('prettier-plugin-tailwindcss')],
    tabWidth: 2,
    singleQuote: true,
    printWidth: 120,
    bracketSpacing: false,
    trailingComma: 'es5',
    endOfLine: 'auto',
  });

  return result;
}

export function assertType<T>(assertion: any): asserts assertion is T {}

function styleStringToStyleObject(style: string): {[key: string]: string} {
  let result: {[key: string]: string} = {};
  for (const line of style.split(';')) {
    const [key, value] = line.split(':');
    result[key.trim()] = value.trim();
  }
  return result;
}

function hyphenate(prop: string) {
  if (prop.indexOf('--') === 0) return prop;
  return prop.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase();
  });
}
glob('C:/code/quickgame2/editor/src/**/*.tsx', {}, function (er, files) {
  console.log(files.length);
  files = files.sort((a, b) => a - b);
  for (const file of files) {
    const code = fs.readFileSync(file, {encoding: 'utf8'});
    console.log(file);
    // console.log(code)
    // console.log(processFile(file, code));

    let result = prettier.format(processFile(file, code), {
      parser: 'typescript',
      plugins: [typescriptPlugin],
      tabWidth: 2,
      singleQuote: true,
      printWidth: 120,
      bracketSpacing: false,
      trailingComma: 'es5',
      endOfLine: 'auto',
    });
    fs.writeFileSync(file, result, {encoding: 'utf8'});
    console.log('done', file);

    // console.log(result);
  }
  console.log('done');
  glob('C:/code/quickgame2/clientCommon/src/**/*.tsx', {}, function (er, files) {
    files = files.sort((a, b) => a - b);
    for (const file of files) {
      const code = fs.readFileSync(file, {encoding: 'utf8'});
      // console.log(processFile(file, code));

      let result = prettier.format(processFile(file, code), {
        parser: 'typescript',
        plugins: [typescriptPlugin],
        tabWidth: 2,
        singleQuote: true,
        printWidth: 120,
        bracketSpacing: false,
        trailingComma: 'es5',
        endOfLine: 'auto',
      });
      fs.writeFileSync(file, result, {encoding: 'utf8'});

      // console.log(result);
    }
  });
});
/*
const result2 = processFile(
  'abc.tsx',
  `
  <div
            use:ss={SS.noSelect.color_white.radius_button.size2xl.text_break_word
              .paddingLeft('m')
              .paddingRight('s')
              .paddingTop('s')
              .paddingBottom('s')
              .backgroundColor('darkerBlue')
              .border('solid 1px #ffffff33')}
          >
            {eSwitch(action.conditions!.condition.type, {
              counterCompare: () => 'Compare A Counter',
              flagCompare: () => 'Compare A Flag',
              positionCompare: () => 'Compare A Position',
              velocityCompare: () => 'Compare A Velocity',
            })}
            <div use:ss={SS.f1}></div>
            <div
              use:ss={SS.block.noFont.color('#bd0a0a')}
              onClick={() => {
                setAction({
                  ...action,
                  conditions: undefined,
                });
              }}
            >
              Clear
            </div>
          </div>
  `
);
console.log(result2);
*/

function SSToTailwind(text: string): {classString: string; styles: string} {
  let iconThing1 = false;
  let iconThing2 = false;
  if (text.includes("[p.image as 'icon']")) {
    iconThing2 = true;
    text = text.replaceAll("[p.image as 'icon']", '');
  }
  if (text.includes("[icon as 'icon']")) {
    iconThing1 = true;
    text = text.replaceAll("[icon as 'icon']", '');
  }

  const CSSPropsThatTakePX = [
    'width',
    'height',
    'top',
    'left',
    'right',
    'bottom',
    'padding',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'paddingBottom',
    'margin',
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginBottom',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderWidth',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'border',
    'borderTop',
    'borderLeft',
    'borderRight',
    'borderBottom',
  ] as const;

  const $SS = () => {
    const classes: [string, boolean][] = [];
    const styles: {[key: string]: any} = {};

    let isSmall = false;
    let isStyle = false;
    let isPreload = false;
    const proxy: any = new Proxy(function () {}, {
      get: (_, prop: string) => {
        if (prop === '$$$PROCESS') {
          classes.unshift(['flex', true]);
          return {classes, styles};
        }
        if (prop === '$s') {
          isSmall = true;
          return proxy;
        }
        if (prop === '$style') {
          isStyle = true;
          return proxy;
        }
        if (prop === 'preload') {
          isPreload = true;
          return proxy;
        }
        let key = prop.replace(/_/g, '-');
        if (isSmall) {
          key = `sm:${key}` as any;
        }
        classes.push([key, true]);

        return proxy;
      },
      apply(_, __, args: any[]): any {
        if (isStyle) {
          Object.assign(styles, args[0]);
          isStyle = false;
          return proxy;
        }
        if (isPreload) {
          isPreload = false;
          if (args[0]) {
            const result = args[0].$$$PROCESS;
            classes.push(...result.classes);
            Object.assign(styles, result.styles);
          }
          return proxy;
        }
        classes[classes.length - 1][1] = args[0];
        /*if (args[0] === true || args[0] === false) {
        } else {
          let camalcaseName = classes.pop()![0];
          if (CSSPropsThatTakePX.includes(camalcaseName as any) && typeof args[0] === 'number') {
            args[0] = String(args[0]) + 'px';
          }
          if (CSSPropsThatTakePX.includes(camalcaseName as any) && typeof args[0] === 'bigint') {
            args[0] = String(args[0]) + 'rem';
          }
          const styleKey = convertCamalCaseToHyphen(camalcaseName);
          styles[styleKey] = args[0];
        }*/
        return proxy;
      },
    });
    return proxy;
  };
  function convertCamalCaseToHyphen(camalcaseName: string): string {
    return camalcaseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function replaceNestedParentheses(str: string) {
    let level = 0;
    let count = 0;
    let output = '';
    let innerOutput = '';
    const params: {type: 'constant' | 'variable'; value: string}[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') {
        if (level === 0) {
          output += `("COUNT${count++}"`;
          // i = str.indexOf(')', i);
        } else {
          innerOutput += str[i];
        }
        level++;
      } else if (str[i] === ')') {
        level--;
        if (level === 0) {
          if (!Number.isNaN(Number(innerOutput))) {
            params.push({type: 'constant', value: innerOutput});
          }
          if (innerOutput.startsWith("'") && innerOutput.endsWith("'")) {
            params.push({type: 'constant', value: innerOutput.slice(1, -1)});
          } else {
            params.push({type: 'variable', value: innerOutput});
          }
          output += str[i];
          innerOutput = '';
        } else {
          innerOutput += str[i];
        }
      } else if (level === 0) {
        output += str[i];
      } else {
        innerOutput += str[i];
      }
    }
    return [output, params] as const;
  }
  let params: {type: 'constant' | 'variable'; value: string}[];

  [text, params] = replaceNestedParentheses(text);
  const SS = $SS();
  const func = new Function('SS', `return ${text}.$$$PROCESS`);
  const j = func(SS);
  let stylesOutput = '';
  let parseOut = ([key, value]: [string, any]) => {
    let innerKey = '';
    let cleanKey = key.replace('sm:', '');
    if (lookups[cleanKey] === undefined) {
      let p = params[Number(value.replace('COUNT', ''))];
      if (p.type === 'variable') {
        if (key.includes('sm')) {
          throw new Error('sm not supported for variables');
        }
        stylesOutput += `'${cleanKey}':${p.value},`;
      } else {
        if (replaceStyles[cleanKey] !== undefined) {
          return (key.includes('sm') ? 'sm:' : '') + `${replaceStyles[cleanKey]}-[${p.value}]`;
        } else {
          console.log('missing style key', key);
          return (key.includes('sm') ? 'sm:' : '') + `${key}-[${p.value}]`;
        }
      }
    }
    if (lookups[cleanKey] === '') {
      innerKey = cleanKey;
    } else {
      innerKey = lookups[cleanKey];
    }
    if (value === true) {
      return (key.includes('sm') ? 'sm:' : '') + innerKey;
    } else {
      if (typeof value === 'string' && value.startsWith('COUNT')) {
        let p = params[Number(value.replace('COUNT', ''))];
        return `\${(${p.value}?('${(key.includes('sm') ? 'sm:' : '') + innerKey}'):'')}`;
      }
    }
    throw new Error(`Invalid value ${value}`);
  };

  const classes = j.classes.map(parseOut);
  // const styles = Object.entries(j.styles).map(parseOutStyle);
  let template = '`' + classes.join(' ') + (iconThing1 ? ' ${icon}' : '') + (iconThing2 ? ' ${p.image}' : '') + '`';
  // console.log(styles);
  return {classString: template, styles: stylesOutput.length === 0 ? null : `{${stylesOutput}}`};
  // console.log(classes, j.styles);
}
