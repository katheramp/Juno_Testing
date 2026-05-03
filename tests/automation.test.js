const {
  addProductToCart,
  addTestMeta,
  captureEvidence,
  clearCart,
  createChromeDriver,
  formatReportTime,
  getDisplayedCount,
  getCartSummarySnapshot,
  parseCurrency,
  tryReadText,
  updateQuantity,
  waitForCartStable
} = require('../functions/helpers');
const { By } = require('selenium-webdriver');
const { LOCATORS } = require('../functions/locators');
const { tc24Data, tc25Data } = require('./ddt');
const { validateTC24, validateTC25 } = require('./validation');

const TESTER_NAME = 'Đào Huỳnh Gia Hân - 81012302863';

function addCommonMeta(testContext, data) {
  addTestMeta(testContext, `Requirement: ${data.requirement}`);
  addTestMeta(testContext, `Expected: ${data.expected}`);
  addTestMeta(testContext, `Product URL: ${data.productUrl || data.url}`);
  addTestMeta(testContext, `New quantity: ${data.newQuantity}`);
  addTestMeta(testContext, `Tester: ${TESTER_NAME}`);
}

describe('Automation giỏ hàng Juno', function () {
  this.timeout(180000);
  let driver;

  before(async function () {
    driver = await createChromeDriver();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // TC24: cập nhật số lượng hợp lệ trong giỏ hàng.
  it(`${tc24Data.testcase} - ${tc24Data.testcasename}`, async function () {
    addCommonMeta(this, tc24Data);
    addTestMeta(this, `Start time: ${formatReportTime(new Date())}`);

    try {
      await clearCart(driver);
      await addProductToCart(driver, tc24Data.productUrl || tc24Data.url, LOCATORS);
      await waitForCartStable(driver, LOCATORS);

      addTestMeta(this, 'Evidence: Ảnh số lượng sản phẩm khi chưa cập nhật.');
      await captureEvidence(driver, this, {
        fileName: 'TC24_screenshot01.png',
        highlightXpaths: [LOCATORS.incrementButtons[0], LOCATORS.totalPrice[0]]
      });

      const quantityInputBefore = await driver.findElement(By.xpath(LOCATORS.quantityInputs[0]));
      const quantityBefore = Number(await quantityInputBefore.getAttribute('value')) || 1;
      const oldTotalText = await tryReadText(driver, LOCATORS.totalPrice);
      const oldTotal = parseCurrency(oldTotalText);
      const oldSummary = await getCartSummarySnapshot(driver);

      const updatedInput = await updateQuantity(driver, LOCATORS, tc24Data.newQuantity);
      const quantityAfter = updatedInput ? Number(await updatedInput.getAttribute('value')) || 0 : 0;

      await driver.sleep(1800);
      const newTotalText = await tryReadText(driver, LOCATORS.totalPrice);
      const newTotal = parseCurrency(newTotalText);
      const newSummary = await getCartSummarySnapshot(driver);

      validateTC24({
        beforeQuantity: quantityBefore,
        afterQuantity: quantityAfter,
        oldTotal,
        newTotal,
        oldSummaryText: oldSummary.summaryText,
        newSummaryText: newSummary.summaryText
      });
    } catch (error) {
      throw error;
    } finally {
      addTestMeta(this, 'Evidence: Ảnh số lượng sản phẩm sau khi cập nhật.');
      await captureEvidence(driver, this, {
        fileName: 'TC24_screenshot02.png',
        highlightXpaths: [LOCATORS.quantityInputs[0], LOCATORS.totalPrice[0]]
      });
      addTestMeta(this, `End time: ${formatReportTime(new Date())}`);
    }
  });

  // TC25: giảm về 0 thì sản phẩm bị xóa khỏi giỏ.
  it(`${tc25Data.testcase} - ${tc25Data.testcasename}`, async function () {
    addCommonMeta(this, tc25Data);
    addTestMeta(this, `Start time: ${formatReportTime(new Date())}`);

    try {
      await clearCart(driver);
      await addProductToCart(driver, tc25Data.productUrl || tc25Data.url, LOCATORS);
      await waitForCartStable(driver, LOCATORS);

      addTestMeta(this, 'Evidence: Ảnh số lượng sản phẩm khi chưa cập nhật.');
      await captureEvidence(driver, this, {
        fileName: 'TC25_screenshot01.png',
        highlightXpaths: [LOCATORS.decrementButtons[0], LOCATORS.totalPrice[0]]
      });

      await updateQuantity(driver, LOCATORS, tc25Data.newQuantity);
      await driver.sleep(2000);

      const itemCountAfterUpdate = await getDisplayedCount(driver, LOCATORS.cartItems);
      const quantityInputsAfterUpdate = await getDisplayedCount(driver, LOCATORS.quantityInputs);
      const emptyMessage = await tryReadText(driver, LOCATORS.cartEmptyMessage);

      validateTC25({
        itemCountAfterUpdate,
        quantityInputsAfterUpdate,
        emptyMessage
      });
    } catch (error) {
      throw error;
    } finally {
      addTestMeta(this, 'Evidence: Ảnh giỏ hàng trống sau khi cập nhật.');
      await captureEvidence(driver, this, {
        fileName: 'TC25_screenshot02.png'
      });
      addTestMeta(this, `End time: ${formatReportTime(new Date())}`);
    }
  });
});
