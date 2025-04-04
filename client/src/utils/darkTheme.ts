import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const chalky = "#e5c07b", coral = "#e06c75", cyan = "#56b6c2", invalid = "#ffffff", ivory = "#abb2bf", stone = "#7d8799", malibu = "#61afef", sage = "#98c379", whiskey = "#d19a66", violet = "#c678dd", darkBackground = "#121212", tooltipBackground = "#353a42", selection = "#3E4451", cursor = "#528bff";

const customDarkTheme = EditorView.theme({
  "&": {
    color: ivory,
    backgroundColor: darkBackground,
  },
  ".cm-content": {
    caretColor: cursor,
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: selection },
  ".cm-gutters": {
    backgroundColor: darkBackground,
    color: stone,
    border: "none",
  },
  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: tooltipBackground,
  },
}, { dark: true });

const customDarkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: violet },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: coral },
  { tag: [tags.function(tags.variableName), tags.labelName], color: malibu },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: whiskey },
  { tag: [tags.definition(tags.name), tags.separator], color: ivory },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: chalky },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: cyan },
  { tag: [tags.meta, tags.comment], color: stone },
  { tag: tags.heading, fontWeight: "bold", color: coral },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: whiskey },
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: sage },
  { tag: tags.invalid, color: invalid },
]);

const customDark = [customDarkTheme, syntaxHighlighting(customDarkHighlightStyle)];

export { customDark };
