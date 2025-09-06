import tokenRevoke from "../DB/models/Token.model.js";
import UserModel, { roleEnum } from "../DB/models/User.model.js";
import { decodeToken, tokenTypesEnum} from "../utils/token.method.js";

const auth = ({tokenType= tokenTypesEnum.access}= {}) => {
    return async (req, res, next) => {
      const { user, decode } = await decodeToken({ next, authorization: req.headers?.authorization, tokenType});
      req.user = user;
      req.decode = decode;
      return next();
    }
}

export default auth;