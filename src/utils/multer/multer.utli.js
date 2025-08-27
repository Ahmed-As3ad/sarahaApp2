import multer from "multer"
import fs from 'node:fs'
import path from 'node:path'

export const fileType = {
    image: ['image/jpeg', 'image/png', 'image/gif']
}

export const localFileUpload = ({ customPath = 'general' } = {}) => {
    let basePath = `uploads/${customPath}`

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (req?.user?._id) {
                basePath += `/${req?.user?._id}/Pf-Image`
            }
            const fullPath = path.resolve(`./src/${basePath}`);
            if (!fs.existsSync((fullPath))) {
                fs.mkdirSync(fullPath, { recursive: true })
            }
            cb(null, fullPath)
        },
        filename: function (req, file, cb) {
            const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname
            file.finalPath = basePath + '/' + uniqueFileName;
            cb(null, uniqueFileName)
        }
    })
    return multer({ dest: './src/uploads/general', storage })
}