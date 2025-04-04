/* eslint-disable @typescript-eslint/no-explicit-any */
export class AttemptsAttendance {
    date: string
    count: number

    constructor(attendance: any) {
        this.count = attendance.count
        this.date = attendance.date
    }
}
