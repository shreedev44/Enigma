import { DataTypes, ProblemParameter } from '@types'
import { generateConstraints } from '@utils'

export function getPrompt(
    description: string,
    functionReturn: {
        functionReturnType: DataTypes
        functionReturnElemType?: DataTypes
        functionReturnNestedType?: Exclude<DataTypes, 'Array'>
    },
    parameters: ProblemParameter[]
) {
    let returnType = ''
    if (functionReturn.functionReturnType === 'Array') {
        if (functionReturn.functionReturnElemType === 'Array') {
            returnType = `[[${functionReturn.functionReturnNestedType}]]`
        } else {
            returnType = `[${functionReturn.functionReturnElemType}]`
        }
    } else {
        returnType = functionReturn.functionReturnType
    }
    return `
    Problem: "${description}"
    Return Type: "${returnType}"
    Parameters: 
    ${JSON.stringify(
        parameters.map((param) => {
            let type: DataTypes | string = param.type
            if (type === 'Array') {
                if (param.elemType === 'Array') {
                    type = '[[' + param.nestedType + ']]'
                } else {
                    type = '[' + param.elemType + ']'
                }
            }
            const constraints = generateConstraints(param)
            return { name: param.name, type: type, constraints: constraints }
        })
    )}
    
    `
}
