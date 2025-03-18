import multer from 'multer'
import { createHttpError } from '@utils'
import { HttpStatus, Messages } from '@constants'


const allowedFiles = ['jpeg', 'png', 'webp', 'jpg']
const storage = multer.memoryStorage()
export const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024 * 1000},
    fileFilter: (req, file, cb) => {
        if(!allowedFiles.includes(file.mimetype.split('/')[1])) {
            return cb(createHttpError(HttpStatus.BAD_REQUEST, Messages.INVALID_FILE_TYPE))
        }
        cb(null, true)
    }
})