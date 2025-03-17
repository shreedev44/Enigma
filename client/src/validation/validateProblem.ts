import { ProblemType } from "@/types/types";
import { camelCaseRegex, nameRegex } from "./regex";

const difficulties = ['Beginner', 'Intermediate', 'Advanced']
const DataTypes = ["Array", "Floating Point", "Integer", "String", "Boolean"]

const isValidFunctionString = (code: string): boolean => {
    try {
      new Function(`return ${code}`)();
      return true;
    } catch (e) {
        console.log(e)
      return false;
    }
  };

export const validateProblem = (problem: ProblemType) => {
    if(!nameRegex.test(problem.title)) {
        return {field: 'title', message: "Please provide a valid title"}
    }
    if(!difficulties.includes(problem.difficulty)) {
        return {field: 'difficulty', message: "Please provide a valid difficulty"}
    }
    if(!problem.description) {
        return {field: 'description', message: "Please provide a description"}
    }
    if(!camelCaseRegex.test(problem.functionName)) {
        return {field: 'functionName', message: "Please provide a valid function name (camelCase)"}
    }
    if(!problem.parameters?.length) {
        return {field: 'parameters', message: "Please provide atleast one parameter"}
    } 
    if(!DataTypes.includes(problem.functionReturnType)) {
        return {field: 'functionReturnType', message: "Please provide a valid function return type"}
    }
    if(problem.functionReturnType === 'Array' && (!problem.functionReturnElemType || !DataTypes.includes(problem.functionReturnElemType))) {
        return {field: 'functionReturnElemType', message: "Please provide a valid function return type"}
    }
    if(problem.functionReturnType === 'Array' && (!problem.functionReturnNestedType || !DataTypes.includes(problem.functionReturnNestedType))) {
        return {field: 'functionReturnNestedType', message: "Please provide a valid function return type"}
    }
    if(!problem.evalFunction || !isValidFunctionString(problem.evalFunction)) {
        return {field: 'evalFunction', message: "Please provide a valid evaluating function"}
    }
}