const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const testData = require('../data/test_data.json');
const locators = require('../functions/locators');
const { captureScreen } = require('../functions/helper');
const addContext = require('mochawesome/addContext');
const moreDetails = addContext;

describe("TC25: Giảm số lượng về 0", function () {
  let driver;
  let startTime;
  const data = testData.find(item => item.testCase === "tc25");

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

  it("Giảm số lượng về 0 thì hiển thị giỏ hàng trống", async function () {
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

    // 4. Bấm nút trừ (-) để giảm số lượng từ 1 về 0
    const decreaseBtnXpath = locators.cartPage.decreaseQtyBtn(data.productName);
    const decreaseBtn = await driver.wait(until.elementLocated(By.xpath(decreaseBtnXpath)), 10000);
    await driver.wait(until.elementIsVisible(decreaseBtn), 10000);

    await decreaseBtn.click();
    await driver.sleep(3000); // Đợi hệ thống xử lý xóa sản phẩm

    // 5. Verify thông báo giỏ hàng trống xuất hiện
    const emptyMsgXpath = locators.cartPage.cartEmptyMessage[0]; // Lấy phần tử đầu tiên trong mảng Locator
    const emptyMsgElements = await driver.findElements(By.xpath(emptyMsgXpath));

    expect(emptyMsgElements.length).to.be.greaterThan(0, "Không hiển thị thông báo giỏ hàng trống sau khi xóa sản phẩm");
  });
});