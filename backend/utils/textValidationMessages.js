import { z } from "zod";

export default function textValidationMessages(name, min, max, pat) {
    return z
        .string(`${name} should be a string.`)
        .min(min, `${name} should have at least ${min} characters.`)
        .max(max, `${name} can only be ${max} characters long.`)
        .regex(
            pat,
            `${name} can only have letters, digits and some special characters.`
        );
}