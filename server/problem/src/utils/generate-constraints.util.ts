import { ProblemParameter } from '@types'

export function generateConstraints(param: ProblemParameter) {
    const constraints: string[] = []
    if (param.type === 'Array') {
        constraints.push(param.paramMinValue + ' <= ' + param.name + '.length' + ' <= ' + param.paramMaxValue)
        if (param.elemType === 'Array') {
            constraints.push(param.elemMinValue + ' <= ' + param.name + '[i].length' + ' <= ' + param.elemMaxValue)
            constraints.push(param.nestedMinValue + ' <= ' + param.name + '[i][j]' + ' <= ' + param.nestedMaxValue)
        } else {
            constraints.push(param.elemMinValue + ' <= ' + param.name + '[i]' + ' <= ' + param.elemMaxValue)
        }
    } else {
        constraints.push(param.paramMinValue + ' <= ' + param.name + ' <= ' + param.paramMaxValue)
    }

    return constraints
}
