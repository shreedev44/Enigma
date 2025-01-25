import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { StudentService } from "../../services/StudentService";
import StudentRepository from "../../repositories/StudentRepository";

const studentService = new StudentService(StudentRepository)
const studentController = new StudentController(studentService)

const studentRouter = Router()


studentRouter.get('/getProfile', studentController.getProfile.bind(studentController))


export default studentRouter