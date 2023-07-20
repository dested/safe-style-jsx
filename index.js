"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertType = exports.processFile = void 0;
const ts_morph_1 = require("ts-morph");
//'const shoes=12;const j=<a $shoes $shoesc={shoes===12} $boes={false} $$width={12} $$shoesEat={"12"} class={shoes?12:"shoes"}><a $shoes $shoesc={shoes===12} $boes={false} $$width={12} $$shoesEat={"12"} class={shoes?12:"shoes"}/></a>'
const project = new ts_morph_1.Project();
function processFile(name, src) {
    const sourceFile = project.createSourceFile(name, src, { overwrite: true });
    let factory = ts_morph_1.ts.factory;
    // this can be done starting on any node and not just the root node
    const j = sourceFile.transform((traversal) => {
        var _a;
        const node = traversal.visitChildren(); // return type is `ts.Node`
        switch (node.kind) {
            case ts_morph_1.ts.SyntaxKind.JsxAttributes:
                const jsxNode = node;
                let properties = jsxNode.properties;
                if (!jsxNode.properties.some((e) => { var _a, _b; return ((_b = (_a = e.name) === null || _a === void 0 ? void 0 : _a.escapedText) === null || _b === void 0 ? void 0 : _b.indexOf('$')) === 0; }))
                    return node;
                const foundProps = [];
                let classAttribute = null;
                let styleAttribute = null;
                const addClasses = [];
                const addStyle = [];
                for (const property of properties) {
                    if (property.kind === 290) {
                        foundProps.push(property);
                        continue;
                    }
                    assertType(property);
                    let name = (_a = property.name) === null || _a === void 0 ? void 0 : _a.escapedText;
                    if (!name) {
                        foundProps.push(property);
                        continue;
                    }
                    if (name.indexOf('$$') === 0) {
                        addStyle.push([name.replace('$$', ''), property.initializer.expression]);
                    }
                    else if (name.indexOf('$') === 0) {
                        addClasses.push([
                            name.replace('$', ''),
                            property.initializer ? property.initializer.expression : true,
                        ]);
                    }
                    else {
                        if (name === 'class') {
                            classAttribute = property.initializer;
                        }
                        else if (name === 'style') {
                            styleAttribute = property;
                        }
                        else
                            foundProps.push(property);
                    }
                }
                if (addClasses.length > 0) {
                    let templateSpans = addClasses.map((e, i) => {
                        if (e[1] === true) {
                            return factory.createTemplateSpan(factory.createStringLiteral(e[0]), i === addClasses.length - 1
                                ? factory.createTemplateTail('', '')
                                : factory.createTemplateMiddle(' ', ' '));
                        }
                        else {
                            return factory.createTemplateSpan(factory.createConditionalExpression(e[1], factory.createToken(ts_morph_1.ts.SyntaxKind.QuestionToken), factory.createStringLiteral(e[0]), factory.createToken(ts_morph_1.ts.SyntaxKind.ColonToken), factory.createStringLiteral('')), i === addClasses.length - 1
                                ? factory.createTemplateTail('', '')
                                : factory.createTemplateMiddle(' ', ' '));
                        }
                    });
                    if (classAttribute) {
                        switch (classAttribute.kind) {
                            case ts_morph_1.ts.SyntaxKind.JsxExpression:
                                templateSpans.unshift(factory.createTemplateSpan(classAttribute.expression, 0 === addClasses.length - 1
                                    ? factory.createTemplateTail('', '')
                                    : factory.createTemplateMiddle(' ', ' ')));
                                break;
                            case ts_morph_1.ts.SyntaxKind.StringLiteral:
                                templateSpans.unshift(factory.createTemplateSpan(classAttribute, 0 === addClasses.length - 1
                                    ? factory.createTemplateTail('', '')
                                    : factory.createTemplateMiddle(' ', ' ')));
                                break;
                        }
                    }
                    foundProps.push(factory.createJsxAttribute(factory.createIdentifier('class'), factory.createJsxExpression(undefined, factory.createTemplateExpression(factory.createTemplateHead('', ''), templateSpans))));
                }
                if (addStyle.length > 0) {
                    const assigns = [];
                    for (const addStyleElement of addStyle) {
                        assigns.push(factory.createPropertyAssignment(hyphenate(addStyleElement[0]), addStyleElement[1]));
                    }
                    if (styleAttribute) {
                        let styleInitializer = styleAttribute.initializer;
                        switch (styleInitializer.kind) {
                            case ts_morph_1.ts.SyntaxKind.JsxExpression:
                                const literal = factory.createObjectLiteralExpression([factory.createSpreadAssignment(styleInitializer), ...assigns], false);
                                foundProps.push(factory.createJsxAttribute(factory.createIdentifier('style'), factory.createJsxExpression(undefined, literal)));
                                break;
                            case ts_morph_1.ts.SyntaxKind.StringLiteral:
                                throw new Error('Cannot transform style string and style fields');
                                break;
                        }
                    }
                    else {
                        const literal = factory.createObjectLiteralExpression(assigns, false);
                        foundProps.push(factory.createJsxAttribute(factory.createIdentifier('style'), factory.createJsxExpression(undefined, literal)));
                    }
                }
                else {
                    if (styleAttribute) {
                        foundProps.push(styleAttribute);
                    }
                }
                return factory.createJsxAttributes(foundProps);
        }
        return node;
    });
    let fullText = j.getFullText();
    sourceFile.delete();
    // console.log(fullText);
    return fullText;
}
exports.processFile = processFile;
function assertType(assertion) { }
exports.assertType = assertType;
function hyphenate(prop) {
    if (prop.indexOf('--') === 0)
        return prop;
    return prop.replace(/[A-Z]/g, function (match) {
        return '-' + match.toLowerCase();
    });
}
