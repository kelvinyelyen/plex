
try {
    require('./src/lib/auth.ts');
    console.log("Import successful");
} catch (e) {
    console.error("Import failed:", e);
    process.exit(1);
}
