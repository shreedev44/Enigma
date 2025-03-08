import { useSidebarContext } from "@/components/adminComponents/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminRoutes } from "@/constants/routeUrl";
import { useEffect, useReducer, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { FaTrash } from "react-icons/fa6";
import {
  DataTypes,
  DifficultyType,
  ProblemParameterType,
  ProblemType,
  TestCaseType,
} from "@/types/types";
import { initialState, parameterReducer } from "@/reducers/parameterReducer";
import { validateParameter } from "@/validation/formValidation";
import { truncate } from "@/utils/utilityFunctions";
import { validateProblem } from "@/validation/validateProblem";
import { addProblem } from "@/api/admin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddProblem = () => {
  const { setBreadcrumbs } = useSidebarContext();
  useEffect(() => {
    setBreadcrumbs([
      { component: "Problems", path: `/admin${adminRoutes.PROBLEMS}` },
      { component: "Add Problem" },
    ]);
  }, []);

  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyType>("Beginner");
  const [parameterField, parameterDispatch] = useReducer(
    parameterReducer,
    initialState
  );
  const [returnType, setReturnType] = useState<DataTypes>("Integer");
  const [returnElementType, setReturnElementType] =
    useState<DataTypes>("Integer");
  const [returnNestedType, setReturnNestedType] =
    useState<Exclude<DataTypes, "Array">>("Integer");
  const [functionName, setFunctionName] = useState("");
  const [parameters, setParameters] = useState<ProblemParameterType[]>([]);
  const [evalFunction, setEvalFunction] = useState(
    `//return a boolean value\nfunction evaluate(output, expected) {\n\t//Your code here \n\treturn output === expected\n}`
  );
  const [testCaseData, setTestCaseData] = useState<Record<string, string>>({});
  const [testCases, setTestCases] = useState<TestCaseType[]>([]);
  const [error, setError] = useState<{ field: string; message: string }>({
    field: "",
    message: "",
  });
  const [paramError, setParamError] = useState<{
    field: string;
    message: string;
  }>({
    field: "",
    message: "",
  });
  const [testCaseError, setTestCaseError] = useState<{
    field: string;
    message: string;
  }>({
    field: "",
    message: "",
  });

  useEffect(() => {
    const initialData: { [key: string]: string } = { output: "" };
    parameters.forEach((param) => {
      initialData[param.name] = "";
    });
    setTestCaseData(initialData);
  }, [parameters]);

  const addParameter = () => {
    const error = validateParameter(parameterField, parameters);
    if (error) {
      setError(error);
      return;
    }

    const newParam: ProblemParameterType = {
      name: parameterField.name,
      type: parameterField.type,
      elemType: parameterField.type,
      paramMaxValue: parameterField.paramMaxValue,
      paramMinValue: parameterField.paramMinValue,
    };
    if (parameterField.type === "Array") {
      newParam.elemType = parameterField.elemType;
      newParam.elemMaxValue = parameterField.elemMaxValue;
      newParam.elemMinValue = parameterField.elemMinValue;
    }
    if (parameterField.elemType === "Array") {
      newParam.nestedType = parameterField.nestedType;
      newParam.nestedMaxValue = parameterField.nestedMaxValue;
      newParam.nestedMinValue = parameterField.nestedMinValue;
    }
    setParamError({ field: "", message: "" });

    const updatedParameters = [...parameters, newParam];
    setParameters(updatedParameters);
    parameterDispatch({ type: "reset", payload: "" });
  };

  const removeParameter = (index: number) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  const addTestCase = () => {
    if (testCases.length >= 5) return;
    if (!testCaseData.expectedOutput) {
      setTestCaseError({
        field: "expectedOutput",
        message: "Output is required",
      });
      return;
    }
    const newTestCase: TestCaseType = { input: [], output: "" };
    parameters.forEach((parameter) => {
      if (!testCaseData[parameter.name]) {
        setTestCaseError({
          field: `param-${parameter.name}`,
          message: `${parameter.name} input is required`,
        });
        return;
      } else {
        newTestCase.input.push({
          parameter: parameter.name,
          value: testCaseData[parameter.name],
        });
      }
    });
    newTestCase.output = testCaseData["expectedOutput"];
    setTestCases([...testCases, newTestCase]);
    setTestCaseError({ field: "", message: "" });
    const newTestCaseData = testCaseData;
    for (const key in newTestCaseData) {
      newTestCaseData[key] = "";
    }
    setTestCaseData(newTestCaseData);
  };

  const removeTestCase = (index: number) => {
    const newTestCases = [...testCases];
    newTestCases.splice(index, 1);
    setTestCases(newTestCases);
  };

  const handleSubmit = async () => {
    const problem: ProblemType = {
      title,
      difficulty,
      description,
      functionName,
      parameters,
      functionReturnType: returnType,
      functionReturnElemType: returnElementType,
      functionReturnNestedType: returnNestedType,
      evalFunction,
      testCases,
    };
    const error = validateProblem(problem);
    if (error) {
      setError(error);
      return;
    }

    const response = await addProblem(problem);

    if (response.success) {
      toast({
        description: response.data.message,
      });
      navigate(`/admin${adminRoutes.PROBLEMS}`);
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-10 md:mt-16">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-8">
          <Label htmlFor="problemName" className="text-sm">
            <strong className="mr-3 text-lg">Title</strong>Give an appropriate
            title for your problem.
          </Label>
          <Input
            type="text"
            placeholder="Eg: Find largest from array"
            id="problemName"
            className={`w-full md:w-2/3 md:mt-3 ${
              error.field === "title" ? "border-red-500" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <Label htmlFor="difficulty" className="text-sm">
            <strong className="mr-3 text-lg">Difficulty</strong> Choose a
            difficulty level for the problem
          </Label>
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as DifficultyType)}
          >
            <SelectTrigger
              className={`md:w-[250px] w-full mb-2 md:mb-0 shadow-md md:mr-2 md:mt-3 
                    ${difficulty === "Beginner" ? "text-green-500" : ""}
                    ${difficulty === "Intermediate" ? "text-yellow-500" : ""}
                    ${difficulty === "Advanced" ? "text-red-500" : ""}
                    ${error.field === "difficulty" ? "border-red-500" : ""}
                  `}
            >
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner" className="text-green-500">
                Beginner
              </SelectItem>
              <SelectItem value="Intermediate" className="text-yellow-500">
                Intermediate
              </SelectItem>
              <SelectItem value="Advanced" className="text-red-500">
                Advanced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-8">
          <Label htmlFor="problemDescription" className="text-sm">
            <strong className="mr-3 text-lkg">Description</strong>Provide a
            meaningful and elaborated description for the users to understand
            the problem easily
          </Label>
          <Textarea
            id="problemDescription"
            className={`resize-none w-full md:w-2/3 h-80 md:mt-3 ${
              error.field === "description" ? "border-red-500" : ""
            }`}
            placeholder="Your discription here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <Label htmlFor="functionName" className="text-sm">
            <strong className="mr-3 text-lg">Function Name</strong>Give a name
            for the function (camelCase)
          </Label>
          <Input
            type="text"
            placeholder="Eg: findLargest"
            id="functionName"
            className={`w-full md:w-1/3 md:mt-3 ${
              error.field === "functionName" ? "border-red-500" : ""
            }`}
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>
        <div
          className={`mb-3 bg-gray-200 dark:bg-zinc-900 rounded-md p-2 md:p-4 md:w-3/4 ${
            error.field === "parameters" ? "border border-red-500" : ""
          }`}
        >
          <Label htmlFor="functionParameters" className="text-sm">
            <strong className="mr-3 text-lg">Parameters</strong> Add all the
            parameters, its type and constraints to be recieved as input
            (camelCase)
          </Label>
          <div className="w-full md:mt-3 md:flex justify-start">
            <Input
              type="text"
              placeholder="Eg: nums"
              id="functionParameters"
              className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/2 ${
                error.field === "parameterName" ? "border-red-500" : ""
              }`}
              value={parameterField.name}
              onChange={(e) =>
                parameterDispatch({ type: "name", payload: e.target.value })
              }
              disabled={parameters.length >= 5}
            />
            <Select
              value={parameterField.type}
              onValueChange={(value) =>
                parameterDispatch({ type: "type", payload: value })
              }
              disabled={parameters.length >= 5}
            >
              <SelectTrigger className="md:w-[250px] w-full mb-2 shadow-md md:mb-0 md:mr-2">
                <SelectValue placeholder="Parameter Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Integer">Integer</SelectItem>
                <SelectItem value="Floating Point">Floating Point</SelectItem>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
                <SelectItem value="Array">Array</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder={(() => {
                if (parameterField.type === "Array")
                  return "Min Length of Array";
                else if (
                  parameterField.type === "Integer" ||
                  parameterField.type === "Floating Point"
                )
                  return "Min Number";
                else return "Min Length of String";
              })()}
              id="min"
              className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/3 ${
                error.field === "paramMinValue" ? "border-red-500" : ""
              }`}
              value={parameterField.paramMinValue}
              onChange={(e) =>
                parameterDispatch({
                  type: "paramMinValue",
                  payload: e.target.value,
                })
              }
              disabled={parameters.length >= 5}
            />
            <Input
              type="text"
              placeholder={(() => {
                if (parameterField.type === "Array")
                  return "Max Length of Array";
                else if (
                  parameterField.type === "Integer" ||
                  parameterField.type === "Floating Point"
                )
                  return "Max Number";
                else return "Max Length of String";
              })()}
              id="max"
              className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/3 ${
                error.field === "paramMaxValue" ? "border-red-500" : ""
              }`}
              value={parameterField.paramMaxValue}
              onChange={(e) =>
                parameterDispatch({
                  type: "paramMaxValue",
                  payload: e.target.value,
                })
              }
              disabled={parameters.length >= 5}
            />
          </div>
          {parameterField.type === "Array" ? (
            <div
              className={`w-full md:mt-3 md:flex justify-start items-center ${
                parameterField.type !== "Array" ? "hidden" : ""
              }`}
            >
              <span className="text-green-500 mr-2">Array Element</span>
              <Select
                value={parameterField.elemType}
                onValueChange={(value) =>
                  parameterDispatch({ type: "elemType", payload: value })
                }
              >
                <SelectTrigger
                  className={`md:w-[250px] w-full mb-2 md:mb-0 shadow-md md:mr-2`}
                >
                  <SelectValue placeholder="Element Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Floating Point">Floating Point</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="Array">Array</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={(() => {
                  if (parameterField.elemType === "Array")
                    return "Min Length of Array";
                  else if (
                    parameterField.elemType === "Integer" ||
                    parameterField.elemType === "Floating Point"
                  )
                    return "Min Number";
                  else return "Min Length of String";
                })()}
                id="min"
                className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/4 ${
                  error.field === "elemMinValue" ? "border-red-500" : ""
                }`}
                value={parameterField.elemMinValue}
                onChange={(e) =>
                  parameterDispatch({
                    type: "elemMinValue",
                    payload: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder={(() => {
                  if (parameterField.elemType === "Array")
                    return "Max Length of Array";
                  else if (
                    parameterField.elemType === "Integer" ||
                    parameterField.elemType === "Floating Point"
                  )
                    return "Max Number";
                  else return "Max Length of String";
                })()}
                id="max"
                className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/4 ${
                  error.field === "elemMaxValue" ? "border-red-500" : ""
                }`}
                value={parameterField.elemMaxValue}
                onChange={(e) =>
                  parameterDispatch({
                    type: "elemMaxValue",
                    payload: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <></>
          )}
          {parameterField.elemType === "Array" ? (
            <div
              className={`w-full md:mt-3 md:flex justify-start items-center`}
            >
              <span className="text-green-500 mr-2">Nested Element</span>
              <Select
                value={parameterField.nestedType}
                onValueChange={(value) =>
                  parameterDispatch({ type: "nestedType", payload: value })
                }
              >
                <SelectTrigger
                  className={`md:w-[250px] w-full mb-2 md:mb-0 shadow-md md:mr-2`}
                >
                  <SelectValue placeholder="Element Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Floating Point">Floating Point</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={(() => {
                  if (parameterField.nestedType === "Array")
                    return "Min Length of Array";
                  else if (
                    parameterField.nestedType === "Integer" ||
                    parameterField.nestedType === "Floating Point"
                  )
                    return "Min Number";
                  else return "Min Length of String";
                })()}
                id="min"
                className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/4 ${
                  error.field === "nestedMinValue" ? "border-red-500" : ""
                }`}
                value={parameterField.nestedMinValue}
                onChange={(e) =>
                  parameterDispatch({
                    type: "nestedMinValue",
                    payload: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder={(() => {
                  if (parameterField.nestedType === "Array")
                    return "Max Length of Array";
                  else if (
                    parameterField.nestedType === "Integer" ||
                    parameterField.nestedType === "Floating Point"
                  )
                    return "Max Number";
                  else return "Max Length of String";
                })()}
                id="max"
                className={`md:mr-2 mb-2 md:mb-0 shadow-md md:w-1/4 ${
                  error.field === "nestedMaxValue" ? "border-red-500" : ""
                }`}
                value={parameterField.nestedMaxValue}
                onChange={(e) =>
                  parameterDispatch({
                    type: "nestedMaxValue",
                    payload: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <></>
          )}
          <div className="md:flex md:justify-end items-center md:mt-5">
            <p className="text-red-500 mr-3">{paramError.message}</p>
            <Button onClick={addParameter} disabled={parameters.length >= 5}>
              Add Parameter
            </Button>
          </div>
        </div>
        <div className="mb-8">
          <Label htmlFor="parameters" className="mr-3 text-sm">
            Current Parameters
          </Label>
          <div id="parameters" className="md:mt-3">
            {parameters.map((value, index) => {
              return (
                <div
                  className="rounded-md bg-bluegrey text-fleace-foreground border px-4 py-2 font-mono text-sm md:w-1/3 text-center mb-2 flex justify-between"
                  key={index}
                >
                  {truncate(value.name, 30)}:{" "}
                  {value.type === "Array"
                    ? value.elemType === "Array"
                      ? `[[${value.nestedType}]]`
                      : `[${value.elemType}]`
                    : value.type}
                  <FaTrash
                    className="cursor-pointer"
                    onClick={() => removeParameter(index)}
                  />
                </div>
              );
            })}
            {!parameters.length ? "None" : ""}
          </div>
        </div>
        <div className="mb-8">
          <Label htmlFor="returnType" className="text-sm">
            <strong className="mr-3 text-lg">Function Return Type</strong>{" "}
            Specify the type of the data to be returned from the function
          </Label>
          <div className="md:flex md:mt-3" id="returnType">
            <Select
              value={returnType}
              onValueChange={(value) => setReturnType(value as DataTypes)}
            >
              <SelectTrigger
                className={`md:w-[250px] w-full mb-2 md:mb-0 md:mr-2 ${
                  error.field === "functionReturnType" ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Parameter Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Integer">Integer</SelectItem>
                <SelectItem value="Floating Point">Floating Point</SelectItem>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
                <SelectItem value="Array">Array</SelectItem>
              </SelectContent>
            </Select>
            {returnType === "Array" ? (
              <Select
                value={returnElementType}
                onValueChange={(value) =>
                  setReturnElementType(value as DataTypes)
                }
              >
                <SelectTrigger
                  className={`md:w-[250px] w-full mb-2 md:mb-0 md:mr-2 ${
                    returnType !== "Array" ? "hidden" : ""
                  }
                     ${
                       error.field === "functionReturnElemType"
                         ? "border-red-500"
                         : ""
                     }`}
                >
                  <SelectValue placeholder="Element Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Floating Point">Floating Point</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="Array">Array</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <></>
            )}
            {returnElementType === "Array" ? (
              <Select
                value={returnNestedType}
                onValueChange={(value) =>
                  setReturnNestedType(value as Exclude<DataTypes, "Array">)
                }
              >
                <SelectTrigger
                  className={`md:w-[250px] w-full mb-2 md:mb-0 ${
                    error.field === "functionReturnNestedType"
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Element Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integer">Integer</SelectItem>
                  <SelectItem value="Floating Point">Floating Point</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mb-8">
          <Label htmlFor="returnType" className="text-sm">
            <strong className="mr-3 text-lg">Evaluating Function</strong> Write
            a function to define the logic of the valuation
          </Label>
          <div
            className={`md:mt-3 ${
              error.field === "evalFunction" ? "border border-red-500" : ""
            }`}
          >
            <CodeEditor code={evalFunction} setCode={setEvalFunction} height="400px" />
          </div>
        </div>
        <div className="mb-8">
          <Label htmlFor="testCase" className="text-sm">
            <strong className="mr-3 text-lg">Test Case</strong>Please provide 5
            test cases
          </Label>
          <div
            id="testCases"
            className={`mb-3 bg-gray-200 dark:bg-zinc-900 rounded-md p-2 md:p-4 md:mt-3 ${
              error.field === "testCases" ? "border border-red-500" : ""
            }`}
          >
            {parameters.length ? (
              <>
                <strong>Input</strong>
                <div className="md:flex">
                  {parameters.map((value, index) => {
                    return (
                      <div
                        className="rounded-md p-1 md: p-2 dark:border-white"
                        key={index}
                      >
                        <div className="flex justify-start md:ml-4">
                          <Input
                            type="text"
                            placeholder={value.name}
                            id="max"
                            className={`md:mr-2 mb-2 md:mb-0 shadow-md ${
                              error.field === `param-${value.name}`
                                ? "border-red-500"
                                : ""
                            }`}
                            value={testCaseData[value.name]}
                            onChange={(e) =>
                              setTestCaseData({
                                ...testCaseData,
                                [value.name]: e.target.value,
                              })
                            }
                            disabled={testCases.length >= 5}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <strong>Output</strong>
                  <Input
                    type="text"
                    placeholder={"Expected Output"}
                    id="max"
                    className={`md:mx-2 mb-2 md:mb-0 md:w-1/4 mt-2 shadow-md ${
                      error.field === `expectedOutput` ? "border-red-500" : ""
                    }`}
                    value={testCaseData.expectedOutput}
                    onChange={(e) =>
                      setTestCaseData({
                        ...testCaseData,
                        expectedOutput: e.target.value,
                      })
                    }
                    disabled={testCases.length >= 5}
                  />
                </div>
                <div className="md:flex md:justify-start items-end md:p-3">
                  <Button
                    className="md:mx-3 md:mt-5"
                    onClick={addTestCase}
                    disabled={testCases.length >= 5}
                  >
                    Add Test Case
                  </Button>
                  <p className="text-red-500 mr-3">{testCaseError.message}</p>
                </div>
              </>
            ) : (
              "Please Add parameters"
            )}
          </div>
        </div>
        <div className="mb-8">
          <Label htmlFor="testCases" className="mr-3 text-sm">
            Current Test Cases: {testCases.length}
          </Label>
          <div id="testCases" className="md:mt-3">
            {testCases.map((testCase, index) => {
              return (
                <div
                  className="rounded-md bg-bluegrey text-fleace-foreground border px-4 py-2 font-mono text-sm md:w-1/2 text-center mb-2 flex justify-between"
                  key={index}
                >
                  <span>{`Input ${truncate(
                    testCase.input.map((input) => input.value).join(""),
                    20
                  )}\t\tOutput ${truncate(testCase.output, 10)}`}</span>
                  <FaTrash
                    className="cursor-pointer"
                    onClick={() => removeTestCase(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-24">
          <p className="text-red-500 mb-3">{error.message}</p>
          <Button
            size={"lg"}
            className="font-bold font-mono mr-2 bg-mildgreen"
            onClick={handleSubmit}
          >
            Add Problem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProblem;
