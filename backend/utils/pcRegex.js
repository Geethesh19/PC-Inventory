const assetIdRegex = /^[A-Z]{2,4}-\d{3,6}$/;

const modelRegex = /^[A-Za-z0-9\s-]{2,50}$/;

const makeRegex = /^[A-Za-z0-9\s-]{2,30}$/;

const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const ipAddressRegex =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const osRegex = /^[A-Za-z0-9\s.-]{2,50}$/;

const ramRegex = /^\d{1,3}(GB|TB)$/i;

const hardDiskRegex = /^\d{1,4}(GB|TB)$/i;

export {
    assetIdRegex,
    modelRegex,
    makeRegex,
    macAddressRegex,
    ipAddressRegex,
    osRegex,
    ramRegex,
    hardDiskRegex
};
