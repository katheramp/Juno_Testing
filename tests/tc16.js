const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const testData = require("../data/test_data.json");
const locators = require("../functions/locators");
const { captureScreen } = require("../functions/helper");
const addContext = require("mochawesome/addContext");
const moreDetails = addContext;

describe("TC16: Lọc sản phẩm theo thuộc tính (Loại sản phẩm/Màu sắc)", function () {
    let driver;
    let startTime;
    // Lấy đúng data của tc16
    const data = testData.find(item => item.testCase === "tc16");

    // Hàm nhỏ để bỏ dấu tiếng Việt khi cần verify text
    function normalizeTextNoTone(text) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        startTime = Date.now();
        await driver.manage().window().maximize();
    });
    beforeEach(function () {
        moreDetails(this, "Tester: Trần Nguyễn Kim Ngân");
        moreDetails(this, `Start: ${new Date(startTime).toLocaleString()}`);
        moreDetails(this, "This is evidence of the test case");
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

    it("Nên lọc đúng sản phẩm Giày cao gót màu Đỏ", async function () {
        // 1. Vào thẳng trang danh mục Giày để khỏi phụ thuộc menu hover trên header
        await driver.get(data.collectionUrl);
        await driver.sleep(3000);

        // 2. Mở Bộ lọc
        const filterBtn = await driver.wait(until.elementLocated(By.xpath(locators.collectionPage.filterBtn)), 10000);
        await driver.wait(until.elementIsVisible(filterBtn), 10000);
        await driver.wait(until.urlContains("/collections/giay"), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", filterBtn);
        await filterBtn.click();
        await driver.sleep(1500);

        // 3. Chọn loại sản phẩm "Giày cao gót"
        const productTypeLabel = await driver.wait(until.elementLocated(By.xpath(locators.collectionPage.filterCheckboxLabelByText(data.productType))), 10000);
        await driver.wait(until.elementIsVisible(productTypeLabel), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", productTypeLabel);
        await productTypeLabel.click();
        await driver.sleep(1000);

        // 4. Chọn màu "Đỏ"
        const colorLabel = await driver.wait(until.elementLocated(By.xpath(locators.collectionPage.filterColorLabel(data.color))), 10000);
        await driver.wait(until.elementIsVisible(colorLabel), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", colorLabel);
        await colorLabel.click();
        await driver.sleep(1000);

        // 5. Verify trạng thái checkbox đã thực sự được tick
        const productTypeCheckbox = await driver.findElement(By.xpath(locators.collectionPage.filterCheckboxByText(data.productType)));
        const colorCheckbox = await driver.findElement(By.xpath(locators.collectionPage.filterColorCheckbox(data.color)));
        expect(await productTypeCheckbox.getAttribute("aria-checked")).to.equal("true");
        expect(await colorCheckbox.getAttribute("aria-checked")).to.equal("true");

        // 6. Bấm Áp dụng để hệ thống load lại danh sách sản phẩm
        const applyBtn = await driver.wait(until.elementLocated(By.xpath(locators.collectionPage.applyBtn)), 10000);
        await driver.wait(until.elementIsVisible(applyBtn), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", applyBtn);
        await applyBtn.click();
        await driver.sleep(3000);

        // 7. Chờ cho danh sách sản phẩm hiển thị lại
        await driver.wait(async () => {
            const cards = await driver.findElements(By.xpath(locators.collectionPage.productCards));
            return cards.length > 0;
        }, 10000, "Không thấy danh sách sản phẩm sau khi áp dụng bộ lọc");

        const productCards = await driver.findElements(By.xpath(locators.collectionPage.productCards));
        expect(productCards.length).to.be.greaterThan(0);

        // 8. Lấy vài card đầu tiên để verify nhanh dữ liệu lọc
        const sampleCards = productCards.slice(0, data.sampleSize);

        for (const card of sampleCards) {
            const productNameElement = await card.findElement(By.xpath(locators.collectionPage.productNameInCard));
            const productName = await productNameElement.getText();
            const redSwatches = await card.findElements(By.xpath(locators.collectionPage.colorSwatchInCard(data.color)));

            expect(normalizeTextNoTone(productName)).to.include("giay");
            expect(redSwatches.length, `Sản phẩm "${productName}" không hiển thị tùy chọn màu ${data.color}`).to.be.greaterThan(0);
        }
    });
});
