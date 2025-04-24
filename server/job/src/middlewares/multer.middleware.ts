import multer from 'multer'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'

const storage = multer.memoryStorage()
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.split('/')[1] !== 'pdf') {
            return cb(createHttpError(_HttpStatus.BAD_REQUEST, Messages.INVALID_FILE_TYPE))
        }
        cb(null, true)
    },
})
