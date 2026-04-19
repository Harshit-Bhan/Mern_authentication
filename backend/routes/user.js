import { Router } from "express";
import { adminController, loginUser, logoutUser, myProfile, refreshCSRF, refreshToken, registerUser, verifyOtp, verifyUser } from "../controllers/user.js";
import { authorizeAdmin, isAuth } from "../middlewares/isAuth.js";
import { verifyCsrfToken } from "../config/csrfMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify/:token",verifyUser )
router.post("/login",loginUser)
router.post("/verify",verifyOtp)
router.get("/me",isAuth,myProfile)
router.post("/refresh",refreshToken)
router.post("/logout",isAuth, verifyCsrfToken, logoutUser)
router.post("/refresh-csrf",isAuth, refreshCSRF)
router.get("/admin",isAuth , authorizeAdmin, adminController)

export default router;

