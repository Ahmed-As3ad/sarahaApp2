import multer from "multer"
import fs from 'node:fs'
import path from 'node:path'

export const fileType = {
    image: ['image/jpeg', 'image/png', 'image/gif']
}

export const cloudFileUpload = ({ validation = [] } = {}) => {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (validation.includes(file.mimetype)) {
            return cb(null, true)
        } else {
            return cb(new Error('Invalid file type'), false)
        }

    }
    return multer({ fileFilter, storage })
}