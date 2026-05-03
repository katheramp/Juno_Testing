const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');
const testData = require('../data/test_data.json');
const locators = require('../functions/locators');
const { captureScreen } = require('../functions/helper');
const addContext = require('mochawesome/addContext');
const moreDetails = addContext;

describe("TC23: Thêm số lượng sản phẩm vượt mức kho còn tồn", function () {
    let driver;
    let startTime;
    // Lấy đúng data của tc23
    const data = testData.find(item => item.testCase === "tc23");

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

    it("Nên hiển thị thông báo lỗi khi mua số lượng vượt quá tồn kho (13 cái)", async function () {
        // 1. Vào web
        await driver.get(data.url);
        await driver.sleep(2000);

        // 2. Tìm kiếm sản phẩm
        const searchInput = await driver.wait(until.elementLocated(By.xpath(locators.header.searchInput)), 10000);
        await driver.wait(until.elementIsVisible(searchInput), 10000);
        await searchInput.sendKeys(data.productName, Key.ENTER);
        await driver.sleep(3000);

        // 3. Chọn sản phẩm đầu tiên
        const firstProduct = await driver.wait(until.elementLocated(By.xpath(locators.searchPage.firstProductLink)), 10000);
        await driver.wait(until.elementIsVisible(firstProduct), 10000);
        await firstProduct.click();
        await driver.sleep(3000);

        // 4. Bấm nút Mua
        const buyBtn = await driver.wait(until.elementLocated(By.xpath(locators.detailPage.buyBtn)), 10000);
        await driver.wait(until.elementIsVisible(buyBtn), 10000);
        await buyBtn.click();
        await driver.sleep(2000);

        // 5. Bấm vào nút Xem giỏ hàng
        const viewCartBtn = await driver.wait(until.elementLocated(By.xpath(locators.miniCartDrawer.viewCartBtn)), 10000);
        await driver.wait(until.elementIsVisible(viewCartBtn), 10000);
        await viewCartBtn.click();
        await driver.sleep(3000);

        // 6. Nhập số lượng vượt tồn kho và Enter
        const qtyInputXpath = locators.cartPage.qtyInput(data.productName);
        const qtyInput = await driver.wait(until.elementLocated(By.xpath(qtyInputXpath)), 10000);

        await qtyInput.sendKeys(Key.CONTROL, 'a');
        await qtyInput.sendKeys(Key.BACK_SPACE);

        // Gõ số và dập Enter thẳng tay luôn
        await qtyInput.sendKeys(data.amountToEnter, Key.ENTER);

        // 7. Verify Notification xuất hiện
        const toastLocator = By.xpath(`//div[@data-title and contains(., '${data.expectedNotification}')]`);

        // Chờ tối đa 10s cho đến khi thẻ thông báo xuất hiện
        const toastElement = await driver.wait(until.elementLocated(toastLocator), 10000, `Không tìm thấy thông báo: ${data.expectedNotification}`);
        await driver.wait(until.elementIsVisible(toastElement), 5000);

        // Dừng 1 chút để Mochawesome kịp chụp ảnh màn hình Toast hiện ra
        await driver.sleep(1000);
    });
});