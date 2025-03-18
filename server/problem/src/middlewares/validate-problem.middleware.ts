import { NextFunction, Request, Response } from "express";
import { HttpStatus, Messages } from "@constants";
import { Regex } from "@constants";
import { isValidFunctionString } from "@utils";

const difficulties = ['Beginner', 'Intermediate', 'Advanced']
const DataTypes = ["Array", "Floating Point", "Integer", "String", "Boolean"]


export const validateProblem = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.body.title || !Regex.NAME.test(req.body.title)) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.TITLE_REQUIRED})
        return;
    }
    if(!req.body.difficulty || !difficulties.includes(req.body.difficulty)) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.DIFFICULTY_REQUIRED})
        return
    }
    if(!req.body.description) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.DESCRIPTION_REQUIRED})
        return
    }
    if(!req.body.functionName || !Regex.CAMEL_CASE.test(req.body.functionName)) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.FUNCTION_NAME_REQUIRED})
        return;
    }
    if(!req.body.parameters || !req.body.parameters?.length) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.NOT_ENOUGHT_PARAMS})
        return
    } 
    if(!req.body.functionReturnType || !DataTypes.includes(req.body.functionReturnType)) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.FUNCTION_RETURN_REQUIRED})
        return
    }
    if(req.body.functionReturnType === 'Array' && (!req.body.functionReturnElemType || !DataTypes.includes(req.body.functionReturnElemType))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.FUNCTION_RETURN_ELEMENT_REQUIRED})
        return;
    }
    if(req.body.functionReturnType === 'Array' && (!req.body.functionReturnNestedType || !DataTypes.includes(req.body.functionReturnNestedType))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.FUNCTION_RETURN_NESTED_REQUIRED})
        return
    }
    if(!req.body.evalFunction || !isValidFunctionString(req.body.evalFunction)) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.EVAL_FUNCTION_REQUIRED})
        return
    }
    next()
}