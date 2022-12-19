import {Project, ts} from 'ts-morph';
import type {
  JsxExpression,
  Identifier,
  Expression,
  JsxAttribute,
  JsxAttributeLike,
  JsxAttributes,
  JsxAttributeValue,
  PropertyAssignment,
} from 'typescript';
import {SyntaxKind} from 'typescript';

const project = new Project();
const sourceFile = project.createSourceFile(
  'Example.tsx',
  'const shoes=12;const j=<a $shoes $shoesc={shoes===12} $boes={false} $$width={12} $$shoesEat={"12"} class={shoes?12:"shoes"}><a $shoes $shoesc={shoes===12} $boes={false} $$width={12} $$shoesEat={"12"} class={shoes?12:"shoes"}/></a>'
);
let factory = ts.factory;

// this can be done starting on any node and not just the root node
const j = sourceFile.transform((traversal) => {
  const node = traversal.visitChildren(); // return type is `ts.Node`
  switch (node.kind) {
    case ts.SyntaxKind.JsxAttributes:
      const jsxNode = node as JsxAttributes;
      let properties = jsxNode.properties;
      if (!jsxNode.properties.some((e) => ((e.name as Identifier).escapedText as string).indexOf('$') === 0))
        return node;

      const foundProps: JsxAttributeLike[] = [];
      let classAttribute: JsxAttributeValue | null = null;
      let styleAttribute: JsxAttribute | null = null;
      const addClasses: [string, Expression | true][] = [];
      const addStyle: [string, Expression][] = [];
      for (const property of properties) {
        if (property.kind === 290) {
          foundProps.push(property);
          continue;
        }
        assertType<JsxAttribute>(property);
        let name = (property.name as Identifier).escapedText as string;
        if (name.indexOf('$$') === 0) {
          addStyle.push([name.replace('$$', ''), (property.initializer as JsxExpression).expression!]);
        } else if (name.indexOf('$') === 0) {
          addClasses.push([
            name.replace('$', ''),
            property.initializer ? (property.initializer as JsxExpression).expression! : true,
          ]);
        } else {
          if (name === 'class') {
            classAttribute = property.initializer!;
          } else if (name === 'style') {
            styleAttribute = property;
          } else foundProps.push(property);
        }
      }
      if (addClasses.length > 0) {
        let templateSpans = addClasses.map((e, i) => {
          if (e[1] === true) {
            return factory.createTemplateSpan(
              factory.createStringLiteral(e[0]),
              i === addClasses.length - 1 ? factory.createTemplateTail('', '') : factory.createTemplateMiddle(' ', ' ')
            );
          } else {
            return factory.createTemplateSpan(
              factory.createConditionalExpression(
                e[1],
                factory.createToken(ts.SyntaxKind.QuestionToken),
                factory.createStringLiteral(e[0]),
                factory.createToken(ts.SyntaxKind.ColonToken),
                factory.createStringLiteral('')
              ),
              i === addClasses.length - 1 ? factory.createTemplateTail('', '') : factory.createTemplateMiddle(' ', ' ')
            );
          }
        });
        if (classAttribute) {
          switch (classAttribute.kind) {
            case ts.SyntaxKind.JsxExpression:
              templateSpans.unshift(
                factory.createTemplateSpan(
                  classAttribute.expression!,
                  0 === addClasses.length - 1
                    ? factory.createTemplateTail('', '')
                    : factory.createTemplateMiddle(' ', ' ')
                )
              );
              break;
            case ts.SyntaxKind.StringLiteral:
              templateSpans.unshift(
                factory.createTemplateSpan(
                  classAttribute,
                  0 === addClasses.length - 1
                    ? factory.createTemplateTail('', '')
                    : factory.createTemplateMiddle(' ', ' ')
                )
              );
              break;
          }
        }
        foundProps.push(
          factory.createJsxAttribute(
            factory.createIdentifier('class'),
            factory.createJsxExpression(
              undefined,
              factory.createTemplateExpression(
                factory.createTemplateHead('', ''),

                templateSpans
              )
            )
          )
        );
      }
      if (addStyle.length > 0) {
        const assigns: PropertyAssignment[] = [];
        for (const addStyleElement of addStyle) {
          assigns.push(factory.createPropertyAssignment(hyphenate(addStyleElement[0]), addStyleElement[1]));
        }
        if (styleAttribute) {
          let styleInitializer = styleAttribute!.initializer!;
          switch (styleInitializer.kind) {
            case ts.SyntaxKind.JsxExpression:
              const literal = factory.createObjectLiteralExpression(
                [factory.createSpreadAssignment(styleInitializer), ...assigns],
                false
              );
              foundProps.push(
                factory.createJsxAttribute(
                  factory.createIdentifier('style'),
                  factory.createJsxExpression(undefined, literal)
                )
              );
              break;
            case ts.SyntaxKind.StringLiteral:
              throw new Error('Cannot transform style string and style fields');
              break;
          }
        } else {
          const literal = factory.createObjectLiteralExpression(assigns, false);
          foundProps.push(
            factory.createJsxAttribute(
              factory.createIdentifier('style'),
              factory.createJsxExpression(undefined, literal)
            )
          );
        }
      } else {
        if (styleAttribute) {
          foundProps.push(styleAttribute);
        }
      }
      return factory.createJsxAttributes(foundProps);
  }
  return node;
});

console.log(j.getFullText());
export function assertType<T>(assertion: any): asserts assertion is T {}

function hyphenate(prop: string) {
  if (prop.indexOf('--') === 0) return prop;
  return prop.replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase();
  });
}
