/* eslint-disable @typescript-eslint/no-explicit-any */

export class GetStudents {
    students: any[]
    totalPages: number

    constructor(returnObj: any) {
        this.totalPages = returnObj.totalPages
        this.students = returnObj.students.map((student: any) => {
            const obj = {
                _id: student._id,
                email: student.email,
                role: student.role,
                status: student.status,
                createdAt: student.createdAt,
                firstName: student.firstName,
                lastName: student.lastName,
                githubProfile: student.githubProfile,
                linkedinProfile: student.linkedinProfile,
                profilePicture: student.profilePicture,
            }
            return obj
        })
    }
}
