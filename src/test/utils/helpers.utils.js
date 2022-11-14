export function describe(name, cb) {
    console.log("- " + name);
    cb();
}

export function test(name, cb) {
    try {
        cb();
        console.log(`\t- ${name} PASSED`);
    } catch (e) {
        console.error(`\t- ${name} FAILED`, e);
    }
}
