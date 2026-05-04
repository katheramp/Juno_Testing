const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

// Hàm tạo thư mục nếu chưa có
function ensureDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

// Hàm chụp ảnh màn hình cơ bản, nhẹ nhàng
async function captureScreen(driver, testContext, nameToSave, testStatus) {
    const rootDir = process.cwd();
    const reportDir = path.join(rootDir, "mochawesome-report");
    const screenshotDir = path.join(reportDir, "screenshots");

    ensureDirectory(screenshotDir);

    const safeName = String(nameToSave || 'test')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/gi, '_');
    const status = testStatus === 'passed' ? "PASS" : "FAIL";
    const fileName = `${safeName}_${Date.now()}_${status}.png`;
    const fullPath = path.join(screenshotDir, fileName);

    try {
        const image = await driver.takeScreenshot();
        fs.writeFileSync(fullPath, image, "base64");
        addContext(testContext, `screenshots/${fileName}`);
        console.log(`--- Đã chụp màn hình: ${fileName}`);
    } catch (err) {
        console.error("Lỗi khi chụp màn hình:", err);
    }
}

module.exports = {
    captureScreen
};