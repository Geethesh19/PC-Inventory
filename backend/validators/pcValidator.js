import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import {
    assetIdRegex,
    modelRegex,
    makeRegex,
    macAddressRegex,
    ipAddressRegex,
    osRegex,
    ramRegex,
    hardDiskRegex
} from "../utils/pcRegex.js";

const pcValidator = z
    .object({
        assetId: z
            .string("Asset ID should be a string")
            .regex(
                assetIdRegex,
                "Asset ID must be in format XX-1234 or XXX-123456"
            ),
        model: textValidationMessages("Model", 2, 50, modelRegex),
        make: textValidationMessages("Make", 2, 30, makeRegex),
        macAddress: z
            .string("MAC address should be a string")
            .regex(macAddressRegex, "Invalid MAC address format")
            .optional(),
        ipAddress: z
            .string("IP address should be a string")
            .regex(ipAddressRegex, "Invalid IP address format")
            .optional(),
        os: z
            .string("OS should be a string")
            .regex(osRegex, "Invalid OS format")
            .optional(),
        ram: z
            .string("RAM should be a string")
            .regex(ramRegex, "RAM must be in format like 8GB or 16GB")
            .optional(),
        hardDisk: z
            .string("Hard disk should be a string")
            .regex(
                hardDiskRegex,
                "Hard disk must be in format like 500GB or 1TB"
            )
            .optional(),
        username: z.string().optional()
    })
    .partial();

export default pcValidator;