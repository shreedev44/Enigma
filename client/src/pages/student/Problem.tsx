import { findProblem } from "@/api/student";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { studentRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { ProblemType } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const useScreenWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const Problem = () => {
  const { problemNo } = useParams<{ problemNo: string }>();
  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState(``);

  const navigate = useNavigate();
  const { toast } = useToast();

  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (!problemNo || isNaN(Number(problemNo))) {
      navigate(studentRoutes.PROBLEM_SET);
      return;
    }
    (async () => {
      setLoading(true);
      const response = await findProblem(Number(problemNo));

      if (response.success) {
        setProblem(response.data.problem);
        setLoading(false);
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
        navigate(studentRoutes.PROBLEM_SET);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setCode(`function ${problem?.functionName}(${problem?.parameters
      .map((parameter) => parameter.name)
      .join(", ")}) {
    
}`);
  }, [problem]);
  return (
    <div className="pt-24">
      <Breadcrumbs
        components={[
          { component: "Home", path: studentRoutes.HOME },
          { component: "Problems", path: studentRoutes.PROBLEM_SET },
          { component: problem?.title || "Problem" },
        ]}
      />
      {loading ? (
        <Skeleton className="flex h-64 m-4 rounded-lg" />
      ) : (
        <>
          <div className="flex flex-col min-h-64 bg-zinc-200 dark:bg-zinc-900 m-4 rounded-lg py-2 px-4 md:py-5 md:px-16">
            <div className="text-lg md:text-2xl font-bold font-mono">
              {problem?.problemNo} {"- "} {problem?.title}
            </div>
            <span
              className={`md:ml-8 mb-5 font-bold text-sm md:text-lg font-mono ${
                problem?.difficulty === "Beginner"
                  ? "text-green-500"
                  : problem?.difficulty === "Intermediate"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {problem?.difficulty}
            </span>
            <div className="whitespace-pre-wrap">{problem?.description}</div>
          </div>
          <div className="mx-4 mb-4">
            <ResizablePanelGroup
              direction={`${screenWidth >= 768 ? "horizontal" : "vertical"}`}
              className="min-h-[200px] w-full rounded-lg border md:min-w-[450px]"
            >
              <ResizablePanel defaultSize={70} minSize={50} maxSize={80}>
                <CodeEditor code={code} setCode={setCode} height="400px" />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <div className="flex h-full justify-center p-6">
                  <Tabs defaultValue="testCases" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="testCases">Test Cases</TabsTrigger>
                      <TabsTrigger value="testResult">Test Result</TabsTrigger>
                    </TabsList>
                    <TabsContent value="testCases">
                      <Card>
                        <ScrollArea className="h-[300px]">
                          <CardContent className="space-y-2">
                            {problem?.testCases.map((testCase, index) => {
                              return (
                                <div key={index} className="mb-5">
                                  <span className="font-extrabold">
                                    Test Case: {index + 1}
                                  </span>
                                  <br />
                                  <span className="ml-2 font-bold">Input</span>
                                  <div className="rounded-md bg-zinc-200 dark:bg-zinc-900 p-1">
                                    {testCase.input.map((input, index) => {
                                      return (
                                        <div key={index} className="ml-3">
                                          <span>{input.parameter} = </span>
                                          <span>{input.value}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </CardContent>
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                    <TabsContent value="testResult">
                      <Card>
                        <CardContent className="space-y-2 ">
                          Test your result by running your solution
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default Problem;
