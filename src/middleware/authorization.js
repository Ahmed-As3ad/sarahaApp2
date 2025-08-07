export const authorization = ({ accessRoles = [] }) => {
    return (req, res, next) => {
        if (accessRoles.length > 0 && !accessRoles.includes(req.user.role)) {
            throw new Error("Access denied! Insufficient permissions.", { cause: 403 });
        }
        next()
    }
}