import mongoose, { Schema } from 'mongoose'
import { ProblemType, TestCaseType } from '@types'
import { IProblemSchema } from '@entities'

const TestCaseSchema = new Schema<TestCaseType>({
    input: [
        {
            parameter: { type: String, required: true },
            value: { type: Schema.Types.Mixed, required: true },
        },
    ],
    output: { type: Schema.Types.Mixed, required: true },
})

const ProblemSchema: Schema = new Schema<IProblemSchema>(
    {
        problemNo: {
            type: Number,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
        },
        description: {
            type: String,
            required: true,
        },
        functionName: {
            type: String,
            required: true,
        },
        parameters: [
            {
                name: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                    enum: ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'],
                },
                paramMinValue: {
                    type: Number,
                    required: true,
                },
                paramMaxValue: {
                    type: Number,
                    required: true,
                },
                elemType: {
                    type: String,
                    enum: ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'],
                },
                elemMinValue: {
                    type: Number,
                },
                elemMaxValue: {
                    type: Number,
                },
                nestedType: {
                    type: String,
                    enum: ['Floating Point', 'Integer', 'String', 'Boolean'],
                },
                nestedMinValue: {
                    type: Number,
                },
                nestedMaxValue: {
                    type: Number,
                },
            },
        ],
        functionReturnType: {
            type: String,
            required: true,
            enum: ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'],
        },
        functionReturnElemType: {
            type: String,
            enum: ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'],
        },
        functionReturnNestedType: {
            type: String,
            enum: ['Floating Point', 'Integer', 'String', 'Boolean'],
        },
        evalFunction: {
            type: String,
            required: true,
        },
        testCases: [TestCaseSchema],
        status: {
            type: String,
            enum: ['listed', 'unlisted'],
            default: 'listed',
        },
        constraints: [
            {
                type: String,
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
)

export interface ProblemDocument extends Document, ProblemType {}

export default mongoose.model<ProblemDocument>('Problem', ProblemSchema, 'Problems')
