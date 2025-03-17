import { IoLogoJavascript } from "react-icons/io5";
import { FaPython, FaJava, FaCode } from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";
import { TbBrandGolang } from "react-icons/tb";
import { TbBrandCpp } from "react-icons/tb";
import CodeEditor from "@/components/CodeEditor";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Language } from "@/types/types";
import { LANGUAGES } from "@/constants/languages";
import { compileCode } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const Compiler = () => {
  const [lanuguage, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panelSize, setPanelSize] = useState(45)
  const [key, setKey] = useState(0)

  const { toast } = useToast();

  useEffect(() => {
    setCode(LANGUAGES[lanuguage].baseCode);
  }, [lanuguage]);

  const shrinkOutput = () => {
    setPanelSize(panelSize > 0 ? 0 : 45)
    setKey(key === 0 ? 1 : 0)
  }

  const handleRun = async () => {
    if (loading) return;

    if (!code.trim()) {
      setOutput("Cannot compile without code");
      return;
    }

    setLoading(true);
    const response = await compileCode(code, lanuguage);

    if (response.success) {
      const result = response.data.result;
      if (result.stderr) {
        setOutput("compile error\n" + result.stderr);
      } else {
        setOutput(result.stdout);
      }
      setLoading(false);
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="flex h-[87vh]">
        <div className="w-min">
          <div
            className={`border ${
              lanuguage === "javascript" ? "border-fleace" : ""
            } border-2 rounded-md m-1 my-3`}
            onClick={() => setLanguage("javascript")}
          >
            <IoLogoJavascript size={30} className="m-1" />
          </div>
          <div
            className={`border ${
              lanuguage === "python" ? "border-fleace" : ""
            } border-2 rounded-md m-1 my-3`}
            onClick={() => setLanguage("python")}
          >
            <FaPython size={30} className="m-1" />
          </div>
          <div
            className={`border ${
              lanuguage === "java" ? "border-fleace" : ""
            } border-2 rounded-md m-1 my-3`}
            onClick={() => setLanguage("java")}
          >
            <FaJava size={30} className="m-1" />
          </div>
          <div
            className={`border ${
              lanuguage === "golang" ? "border-fleace" : ""
            } border-2 rounded-md m-1 my-3`}
            onClick={() => setLanguage("golang")}
          >
            <TbBrandGolang size={30} className="m-1" />
          </div>
          <div
            className={`border ${
              lanuguage === "cpp" ? "border-fleace" : ""
            } border-2 rounded-md m-1 my-3`} 
            onClick={() => setLanguage("cpp")}
          >
            <TbBrandCpp size={30} className="m-1" />
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full"
        >
          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="w-full">
              <div className="flex justify-between border-b-2 items-center">
                <p className="text-xl font-mono font-bold ml-3">
                  Main.{LANGUAGES[lanuguage].extension}
                </p>
                <div className="flex items-center">
                  <Button
                    className="m-3 bg-mildgreen"
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? (
                      <ClassicSpinner />
                    ) : (
                      "Run"
                    )}
                    {!loading ? (
                      <FaCode />
                    ) : (<></>)}
                  </Button>
                  <Button
                    className="m-3"
                    variant={"outline"}
                    onClick={() => setCode(LANGUAGES[lanuguage].reset)}
                  >
                    Clear
                  </Button>

                  <Button variant={"outline"} className="mr-2" onClick={shrinkOutput}>
                    <FiMaximize2 />
                  </Button>
                </div>
              </div>
              <CodeEditor code={code} setCode={setCode} height="79vh" language={lanuguage} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={panelSize} maxSize={70} minSize={0} key={key} >
            <div className="w-full">
              <div className="flex justify-between border-b-2 items-center">
                <p className="text-xl font-mono font-bold ml-3">Output</p>
                <Button
                  className="m-3"
                  variant={"outline"}
                  onClick={() => setOutput("")}
                >
                  Clear
                </Button>
              </div>
              <ScrollArea className="h-[79vh]">
                <div className="m-3 font-mono whitespace-pre-wrap">{output}</div>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Compiler;
