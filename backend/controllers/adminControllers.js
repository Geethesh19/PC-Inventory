import { PrismaClient } from "@prisma/client";
import { pcValidator } from "../validators/index.js";

const prisma = new PrismaClient();

// POST http://localhost:4000/api/admin/pc
async function createPC(req, res) {
    const {
        assetId,
        model,
        make,
        macAddress,
        ipAddress,
        os,
        ram,
        hardDisk,
        username,
        metadata
    } = req.body;
    if (!assetId || !model || !make) {
        return res
            .status(400)
            .send({ message: "Asset ID, Model and Make are required." });
    }

    let userId = null;
    if (username) {
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        userId = user.id;
    }

    const data = {
        assetId,
        model,
        make,
        macAddress,
        ipAddress,
        os,
        ram,
        hardDisk,
        userId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
    };

    const validationResult = pcValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const pc = await prisma.pC.findUnique({
        where: { assetId }
    });
    if (pc) {
        return res.status(400).send({ message: "Asset ID already exists." });
    }

    await prisma.pC.create({
        data
    });

    return res
        .status(200)
        .send({ message: `PC ${assetId} created successfully.` });
}

// GET http://localhost:4000/api/admin/pc/:assetId
async function readPC(req, res) {
    const pc = await prisma.pC.findUnique({
        where: { assetId: req.params.assetId }
    });
    if (!pc) {
        return res.status(404).send({ message: "PC not found." });
    }

    return res.status(200).send(pc);
}

// GET http://localhost:4000/api/admin/pcs
async function readPCs(req, res) {
    const pcs = await prisma.pC.findMany({include: {
            user: true
        }});
    return res.status(200).send(pcs);
}

// PUT http://localhost:4000/api/admin/pc/:assetId
async function updatePC(req, res) {
    const pc = await prisma.pC.findUnique({
        where: { assetId: req.params.assetId }
    });
    if (!pc) {
        return res.status(404).send({ message: "PC not found." });
    }

    const {
        model,
        make,
        macAddress,
        ipAddress,
        os,
        ram,
        hardDisk,
        username,
        metadata
    } = req.body;
    if (
        !model &&
        !make &&
        !macAddress &&
        !ipAddress &&
        !os &&
        !ram &&
        !hardDisk &&
        !username &&
        !metadata
    ) {
        return res
            .status(400)
            .send({ message: "At least one field is required to update." });
    }

    const data = {};
    let cou = 0;

    if (model && pc.model !== model) {
        data.model = model;
        cou++;
    }
    if (make && pc.make !== make) {
        data.make = make;
        cou++;
    }
    if (macAddress && pc.macAddress !== macAddress) {
        data.macAddress = macAddress;
        cou++;
    }
    if (ipAddress && pc.ipAddress !== ipAddress) {
        data.ipAddress = ipAddress;
        cou++;
    }
    if (os && pc.os !== os) {
        data.os = os;
        cou++;
    }
    if (ram && pc.ram !== ram) {
        data.ram = ram;
        cou++;
    }
    if (hardDisk && pc.hardDisk !== hardDisk) {
        data.hardDisk = hardDisk;
        cou++;
    }
    if (username && pc.username !== username) {
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        data.username = username;
        cou++;
    }
    if (metadata && JSON.stringify(pc.metadata) !== JSON.stringify(metadata)) {
        data.metadata = metadata;
        cou++;
    }

    if (!cou) {
        return res
            .status(400)
            .send({ message: "Given fields are same as original." });
    }

    const validationResult = pcValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    await prisma.pC.update({
        where: { assetId: req.params.assetId },
        data
    });

    return res
        .status(200)
        .send({ message: `PC ${req.params.assetId} updated successfully.` });
}

// DELETE http://localhost:4000/api/admin/pc/:assetId
async function deletePC(req, res) {
    const pc = await prisma.pC.findUnique({
        where: { assetId: req.params.assetId }
    });
    if (!pc) {
        return res.status(404).send({ message: "PC not found." });
    }

    await prisma.pC.delete({
        where: { assetId: req.params.assetId }
    });

    return res
        .status(200)
        .send({ message: `PC ${req.params.assetId} deleted successfully.` });
}

export { createPC, readPC, updatePC, deletePC, readPCs };
