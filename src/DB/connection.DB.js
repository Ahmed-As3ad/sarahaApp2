import mongoose from "mongoose";

const connection = () => {
    try {
        const result = mongoose.connect(process.env.DB_URI, {})
        console.log(`DB Connected ✔️`);
    } catch (error) {
        console.log(`DB fail connect ❌`, error);
    }
}
export default connection