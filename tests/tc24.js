const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const testData = require('../data/test_data.json');
const locators = require('../functions/locators');
const { captureScreen } = require('../functions/helper');
const addContext = require('mochawesome/addContext');
const moreDetails = addContext;

describe("TC24: Cập nhật số lượng hợp lệ và tổng tiền thay đổi đúng", function () {
  let driver;
  let startTime;
  const data = testData.find(item => item.testCase === "tc24");

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    startTime = Date.now();
    await driver.manage().window().maximize();
  });
  beforeEach(function () {
    moreDetails(this, "Tester: Đào Huỳnh Gia Hân");
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

  it("Nên cập nhật số lượng và tổng tiền thành công", async function () {
    // 1. Vào trang sản phẩm
    await driver.get(data.url);
    await driver.sleep(2000);

    // 2. Bấm nút Mua
    const buyBtn = await driver.wait(until.elementLocated(By.xpath(locators.detailPage.buyBtn)), 10000);
    await driver.wait(until.elementIsVisible(buyBtn), 10000);
    await buyBtn.click();
    await driver.sleep(2000);

    // 3. Vào giỏ hàng
    const viewCartBtn = await driver.wait(until.elementLocated(By.xpath(locators.miniCartDrawer.viewCartBtn)), 10000);
    await driver.wait(until.elementIsVisible(viewCartBtn), 10000);
    await viewCartBtn.click();
    await driver.sleep(3000);

    // 4. Lấy tổng tiền ban đầu
    const oldTotalEl = await driver.wait(until.elementLocated(By.xpath(locators.cartPage.totalAmount)), 10000);
    const oldTotalText = await oldTotalEl.getText();
    const oldTotal = parseInt(oldTotalText.replace(/[^0-9]/g, ''));

    // 5. Bấm nút cộng (+) để tăng số lượng từ 1 lên 2
    const increaseBtnXpath = locators.cartPage.increaseQtyBtn(data.productName);
    const increaseBtn = await driver.wait(until.elementLocated(By.xpath(increaseBtnXpath)), 10000);
    await driver.wait(until.elementIsVisible(increaseBtn), 10000);

    await increaseBtn.click();
    await driver.sleep(3000); // Đợi hệ thống load lại giá

    // 6. Verify giá tiền phải lớn hơn giá cũ
    const newTotalEl = await driver.wait(until.elementLocated(By.xpath(locators.cartPage.totalAmount)), 10000);
    const newTotalText = await newTotalEl.getText();
    const newTotal = parseInt(newTotalText.replace(/[^0-9]/g, ''));

    expect(newTotal).to.be.greaterThan(oldTotal, "Tổng tiền không tăng lên sau khi thêm số lượng");
  });
});