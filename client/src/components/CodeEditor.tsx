import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp"
import {search} from '@codemirror/search'
import { autocompletion } from "@codemirror/autocomplete";
import { customDark } from "@/utils/darkTheme";
import { EditorView } from "@codemirror/view";
import { bracketMatching, LanguageSupport } from "@codemirror/language";
import { useTheme } from "@/context/ThemeContext";
import { Language } from "@/types/types";

const CodeEditor = ({
  code,
  setCode,
  height,
  language
}: {
  code: string;
  setCode: (value: string) => void;
  height: string;
  language: Language
}) => {
  const { theme } = useTheme();
  const lightTheme = EditorView.theme(
    {
      "&": { backgroundColor: "white", color: "black" },
      ".cm-content": { caretColor: "black" },
      "&.cm-focused .cm-cursor": { borderLeftColor: "black" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
        {
          backgroundColor: "#d7d4f0",
        },
    },
    { dark: false }
  );
  const extensions: Record<Language, () => LanguageSupport> = {
    "javascript": javascript,
    "python": python,
    "java": java,
    "golang": go,
    "cpp": cpp
  }
  return (
    <CodeMirror
      value={code}
      height={height}
      theme={theme === 'light' ? lightTheme : customDark}
      extensions={[extensions[language](), bracketMatching(), EditorView.lineWrapping, search(), autocompletion()]}
      onChange={(value) => setCode(value)}
    />
  );
};

export default CodeEditor;
