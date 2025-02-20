import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { bracketMatching } from "@codemirror/language";
import { useTheme } from "@/context/ThemeContext";

const CodeEditor = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (value: string) => void;
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
  return (
    <CodeMirror
      value={code}
      height="400px"
      theme={theme === 'light' ? lightTheme : oneDark}
      extensions={[javascript(), bracketMatching(), EditorView.lineWrapping]}
      onChange={(value) => setCode(value)}
    />
  );
};

export default CodeEditor;
