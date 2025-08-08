import { roleEnum } from "../../DB/models/User.model.js";


export const endpoint = {
    profile: roleEnum.user,
    deleteAcc:roleEnum.Admin
}