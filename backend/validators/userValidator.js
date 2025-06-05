import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import {
    nameRegex,
    usernameRegex,
    emailRegex,
    passwordRegex,
    designationRegex,
    divisionRegex
} from "../utils/userRegex.js";

const userValidator = z
    .object({
        name: textValidationMessages("Name", 2, 50, nameRegex),
        username: textValidationMessages("Username", 5, 32, usernameRegex),
        email: z
            .string("Email should be a string.")
            .email("Not a valid email")
            .regex(
                emailRegex,
                "Email can only have letters, digits and some special characters."
            ),
        password: textValidationMessages("Password", 8, 60, passwordRegex),
        designation: textValidationMessages(
            "Designation",
            2,
            50,
            designationRegex
        ),
        division: textValidationMessages("Division", 2, 50, divisionRegex)
    })
    .partial();

export default userValidator;
