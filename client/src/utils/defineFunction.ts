import { DataTypes, Language, ProblemType } from "@/types/types";

export function defineFunction(problem: ProblemType, language: Language) {
    const dataTypes = {
        "Integer": {
          java: "int",
          golang: "int"
        },
        "Floating Point": {
          java: "float",
          golang: "float32"
        },
        "String": {
          java: "String",
          golang: "string"
        },
        "Boolean": {
          java: "boolean",
          golang: "bool"
        },
        "Array": {
          java: "",
          golang: ""
        }
    }

  let code = `function ${problem?.functionName}(${problem?.parameters
    .map((parameter) => parameter.name)
    .join(", ")}) {
    
}`;
  if (language === "python") {
    code = `def ${problem?.functionName}(${problem?.parameters
      .map((parameter) => parameter.name)
      .join(", ")}):`;
  }
  if (language === "java") {
    const parameters = problem?.parameters
      .map((param) => {
        let type: string = dataTypes[param.type].java;
        if (type === "Array") {
          if (param.elemType === "Array") {
            type = dataTypes[param.nestedType as DataTypes].java + "[][]";
          } else {
            type = dataTypes[param.elemType as DataTypes].java + "[]";
          }
        }
        return `${type} ${param.name}`;
      })
      .join(", ");
    let type = dataTypes[problem.functionReturnType].java;
    if (type === "Array") {
      if (problem.functionReturnElemType === "Array") {
        type = dataTypes[problem.functionReturnNestedType as DataTypes].java + "[][]";
      } else {
        type = dataTypes[problem.functionReturnElemType as DataTypes].java + "[]";
      }
    }
    code = `class Solution {
    public ${type} ${problem?.functionName}(${parameters}) {
        
    }
}`;
  }
  if(language === 'golang') {
    const paramters = problem?.parameters.map((param) => {
      let type: string = dataTypes[param.type].golang;
        if (type === "Array") {
          if (param.elemType === "Array") {
            type = "[][]" + dataTypes[param.nestedType as DataTypes].golang;
          } else {
            type = "[]" + dataTypes[param.elemType as DataTypes].golang;
          }
        }
        return `${param.name} ${type}`;
    })
    let type = dataTypes[problem.functionReturnType].java;
    if (type === "Array") {
      if (problem.functionReturnElemType === "Array") {
        type = "[][]" + dataTypes[problem.functionReturnNestedType as DataTypes].golang;
      } else {
        type = "[]" + dataTypes[problem.functionReturnElemType as DataTypes].golang;
      }
    }
    code = `func ${problem?.functionName}(${paramters}) ${type} {
    
}`
  }

  return code;
}
