const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');
const testData = require('../data/test_data.json');
const locators = require('../functions/locators');
const { captureScreen } = require('../functions/helper');
const addContext = require('mochawesome/addContext');
const moreDetails = addContext;

describe("TC22: Thêm số lượng sản phẩm hợp lệ với số lượng kho còn tồn", function () {
    let driver;
    let startTime;
    // Lấy đúng data của tc22
    const data = testData.find(item => item.testCase === "tc22");

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();

        startTime = Date.now();
        moreDetails(this, "Tester: LY HIEU VY");
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

    it("Nên tự động cập nhật tổng tiền khi thay đổi số lượng thành 12", async function () {
        // 1. Vào web và đợi một chút cho trang load hẳn các element ẩn
        await driver.get(data.url);
        await driver.sleep(2000);

        // 2. Tìm kiếm sản phẩm
        const searchInput = await driver.wait(until.elementLocated(By.xpath(locators.header.searchInput)), 10000);
        await driver.wait(until.elementIsVisible(searchInput), 10000); // Chờ nó thực sự hiển thị
        await searchInput.sendKeys(data.productName, Key.ENTER);
        await driver.sleep(3000); // Dừng 3s để nhìn kết quả tìm kiếm load ra

        // 3. Chọn sản phẩm đầu tiên
        const firstProduct = await driver.wait(until.elementLocated(By.xpath(locators.searchPage.firstProductLink)), 10000);
        await driver.wait(until.elementIsVisible(firstProduct), 10000);
        await firstProduct.click();
        await driver.sleep(3000); // Dừng 3s để đợi trang Chi tiết sản phẩm load xong

        // 4. Bấm nút Mua
        const buyBtn = await driver.wait(until.elementLocated(By.xpath(locators.detailPage.buyBtn)), 10000);
        await driver.wait(until.elementIsVisible(buyBtn), 10000);
        await buyBtn.click();
        await driver.sleep(2000); // Đợi cái Mini Drawer (Giỏ hàng nhỏ) trượt từ phải sang

        // 5. Bấm vào nút Xem giỏ hàng trong Mini Drawer
        const viewCartBtn = await driver.wait(until.elementLocated(By.xpath(locators.miniCartDrawer.viewCartBtn)), 10000);
        await driver.wait(until.elementIsVisible(viewCartBtn), 10000);
        await viewCartBtn.click();
        await driver.sleep(3000); // Đợi load sang trang Giỏ hàng lớn

        // 6. Gõ thêm số lượng vào input trang Giỏ Hàng
        const qtyInputXpath = locators.cartPage.qtyInput(data.productName);
        const qtyInput = await driver.wait(until.elementLocated(By.xpath(qtyInputXpath)), 10000);
        await driver.wait(until.elementIsVisible(qtyInput), 10000);

        await qtyInput.sendKeys(data.amountToEnter, Key.ENTER);
        await driver.sleep(2000); // Dừng 2s để hệ thống gọi API cập nhật lại giá tiền

        // 7. Chờ hệ thống load lại giá và Verify
        const totalAmountLocator = By.xpath(locators.cartPage.totalAmount);
        await driver.wait(async () => {
            const el = await driver.findElement(totalAmountLocator);
            const text = await el.getText();
            return text.includes(data.expectedPrice);
        }, 10000, `Tổng tiền không cập nhật thành ${data.expectedPrice} sau 10s`);

        const finalPriceEl = await driver.findElement(totalAmountLocator);
        const finalPrice = await finalPriceEl.getText();

        expect(finalPrice).to.include(data.expectedPrice);
    });
});