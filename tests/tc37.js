const { Builder, By, until, Key } = require("selenium-webdriver");
const { expect } = require("chai");
const testData = require("../data/test_data.json");
const locators = require("../functions/locators");
const { captureScreen } = require("../functions/helper");
const addContext = require("mochawesome/addContext");
const moreDetails = addContext;

describe("TC37: Kiểm tra hiển thị cảnh báo lỗi khi nhập Số điện thoại chứa ký tự chữ cái", function () {
    let driver;
    let startTime;
    // Lấy đúng data của tc37
    const data = testData.find(item => item.testCase === "tc37");

    // Hàm dùng riêng cho case này:
    // Một số button trên site render text hơi trễ nên tìm theo getText() sẽ bền hơn XPath thuần
    async function findButtonByText(text, timeout = 20000) {
        await driver.wait(async () => {
            const buttons = await driver.findElements(By.css("button"));

            for (const button of buttons) {
                const label = (await button.getText()).trim();
                if (label.includes(text)) return true;
            }

            return false;
        }, timeout, `Không tìm thấy button có text: ${text}`);

        const buttons = await driver.findElements(By.css("button"));

        for (const button of buttons) {
            const label = (await button.getText()).trim();
            if (label.includes(text)) return button;
        }

        throw new Error(`Không tìm thấy button sau khi wait: ${text}`);
    }

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();

        startTime = Date.now();
        moreDetails(this, "Tester: Trần Nguyễn Kim Ngân (KimNgan) - MSSV: 81012302877");
        moreDetails(this, `Start: ${new Date(startTime).toLocaleString()}`);
        moreDetails(this, "This is evidence of the test case");

        await driver.manage().window().maximize();
    });

    afterEach(async function () {
        await captureScreen(driver, this, this.currentTest.title, this.currentTest.state);
    });

    after(async function () {
        const endTime = Date.now();
        const duration = endTime - startTime;
        moreDetails(this, `End: ${new Date(endTime).toLocaleString()}`);
        moreDetails(this, `Duration: ${duration} ms`);

        if (driver) await driver.quit();
    });

    it("Nên chặn lưu và hiển thị cảnh báo khi nhập SĐT abc1234567", async function () {
        // 1. Vào trang chi tiết sản phẩm để thêm nhanh 1 sản phẩm vào giỏ
        await driver.get(data.productUrl);
        await driver.sleep(3000);

        // 2. Bấm nút Mua
        const buyBtn = await driver.wait(until.elementLocated(By.xpath(locators.detailPage.buyBtn)), 10000);
        await driver.wait(until.elementIsVisible(buyBtn), 10000);
        await buyBtn.click();
        await driver.sleep(2500);

        // 3. Bấm Xem giỏ hàng trong Mini Drawer
        const viewCartBtn = await driver.wait(until.elementLocated(By.xpath(locators.miniCartDrawer.viewCartBtn)), 10000);
        await driver.wait(until.elementIsVisible(viewCartBtn), 10000);
        await viewCartBtn.click();
        await driver.sleep(5000);

        // 4. Bấm nút TIẾN HÀNH THANH TOÁN
        const checkoutBtn = await findButtonByText("TIẾN HÀNH THANH TOÁN");
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", checkoutBtn);
        await checkoutBtn.click();
        await driver.sleep(4000);

        // 5. Nếu hệ thống đang hiện popup rỗng thì bấm "Tạo bằng cách nhập tay"
        const createManualAddressButtons = await driver.findElements(By.xpath(locators.addressPopup.createManualAddressBtn));
        if (createManualAddressButtons.length > 0) {
            await driver.wait(until.elementIsVisible(createManualAddressButtons[0]), 10000);
            await createManualAddressButtons[0].click();
            await driver.sleep(1500);
        }

        // 6. Nếu có thêm bước "Tạo địa chỉ" thì xử lý luôn để mở form nhập tay
        const createAddressButtons = await driver.findElements(By.xpath(locators.addressPopup.createAddressBtn));
        if (createAddressButtons.length > 0) {
            await driver.wait(until.elementIsVisible(createAddressButtons[0]), 10000);
            await createAddressButtons[0].click();
            await driver.sleep(1500);
        }

        // 7. Chờ popup "Thêm địa chỉ mới" hiển thị
        const popupTitle = await driver.wait(until.elementLocated(By.xpath(locators.addressPopup.title)), 10000);
        await driver.wait(until.elementIsVisible(popupTitle), 10000);

        // 8. Nhập SĐT có chứa chữ cái
        const phoneInput = await driver.wait(until.elementLocated(By.xpath(locators.addressPopup.phoneInput)), 10000);
        await driver.wait(until.elementIsVisible(phoneInput), 10000);
        await phoneInput.sendKeys(Key.COMMAND, "a");
        await phoneInput.sendKeys(Key.BACK_SPACE);
        await phoneInput.sendKeys(data.phoneInvalid);
        await driver.sleep(1000);

        // 9. Bấm Lưu
        const saveBtn = await findButtonByText("Lưu", 10000);
        await saveBtn.click();
        await driver.sleep(1500);

        // 10. Verify cảnh báo lỗi đúng xuất hiện ngay trong popup
        const phoneErrors = await driver.wait(async () => {
            const elements = await driver.findElements(By.xpath(locators.addressPopup.phoneError));
            return elements.length > 0 ? elements : false;
        }, 10000, `Không tìm thấy cảnh báo: ${data.expectedValidation}`);

        const actualValidation = await phoneErrors[0].getText();
        expect(actualValidation).to.include(data.expectedValidation);
        expect(await popupTitle.isDisplayed()).to.equal(true);
    });
});
