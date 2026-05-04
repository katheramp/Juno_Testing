const { expect } = require('chai');
const testData = require('../data/data.json');
const {
  addProductToCart,
  addTestMeta,
  captureScreen,
  clearCart,
  createChromeDriver,
  findFirstDisplayedValue,
  formatReportTime,
  getCartSummarySnapshot,
  parseCurrency,
  removeTempChromeProfile,
  tryReadText,
  updateQuantity,
  waitForCartStable
} = require('../functions/helpers');
const { LOCATORS } = require('../functions/locators');

const TESTER_NAME = 'Đào Huỳnh Gia Hân - 81012302863';
const tc24Data = testData.find(item => item.testcase === 'TC24');

if (!tc24Data) {
  throw new Error('Không tìm thấy dữ liệu TC24 trong data/data.json');
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs))
  ]);
}

function validateTC24({ beforeQuantity, afterQuantity, expectedQuantity, oldTotal, newTotal, oldSummaryText, newSummaryText }) {
  expect(afterQuantity).to.equal(
    expectedQuantity,
    `Số lượng sau cập nhật không đúng. Trước=${beforeQuantity}, Sau=${afterQuantity}, Mong đợi=${expectedQuantity}`
  );

  const totalChanged = oldTotal > 0 && newTotal > oldTotal;
  const summaryChanged = oldSummaryText !== newSummaryText;
  expect(totalChanged || summaryChanged).to.equal(
    true,
    `Tổng tiền chưa tăng hoặc phần tóm tắt chưa đổi. Trước=${oldTotal} (${oldSummaryText}), Sau=${newTotal} (${newSummaryText})`
  );
}

describe(`${tc24Data.testcase}: ${tc24Data.testcasename}`, function () {
  this.timeout(240000);
  this.retries(1);
  let driver;

  before(async function () {
    driver = await createChromeDriver();
    addTestMeta(this, `Tester: ${TESTER_NAME}`);
    addTestMeta(this, `Requirement: ${tc24Data.requirement}`);
    addTestMeta(this, `Expected: ${tc24Data.expected}`);
    addTestMeta(this, `Product URL: ${tc24Data.productUrl || tc24Data.url}`);
  });

  beforeEach(function () {
    addTestMeta(this, `Tester: ${TESTER_NAME}`);
    addTestMeta(this, `Start Time: ${formatReportTime(new Date())}`);
    addTestMeta(this, 'Evidence: Screenshot after test execution.');
  });

  afterEach(async function () {
    try {
      await withTimeout(
        captureScreen(driver, this, `${tc24Data.testcase}_${this.currentTest.title}`, this.currentTest.state),
        20000,
        'Timeout khi chụp screenshot TC24'
      );
    } catch (error) {
      // Không làm fail hook chỉ vì screenshot bị treo.
    }
    addTestMeta(this, `End Time: ${formatReportTime(new Date())}`);
  });

  after(async function () {
    if (driver) {
      try {
        await withTimeout(driver.quit(), 20000, 'Timeout khi đóng trình duyệt TC24');
      } catch (error) {
        // Bỏ qua lỗi đóng browser để không treo toàn bộ run.
      } finally {
        removeTempChromeProfile(driver);
      }
    }
  });

  it('Cập nhật số lượng hợp lệ và tổng tiền thay đổi đúng', async function () {
    await clearCart(driver);
    await addProductToCart(driver, tc24Data.productUrl || tc24Data.url, LOCATORS);
    await waitForCartStable(driver, LOCATORS);

    // Dùng locator fallback để tránh phụ thuộc vào XPath đầu tiên.
    const { value: quantityBefore } = await findFirstDisplayedValue(driver, LOCATORS.quantityInputs, 10000);
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
      expectedQuantity: tc24Data.newQuantity,
      oldTotal,
      newTotal,
      oldSummaryText: oldSummary.summaryText,
      newSummaryText: newSummary.summaryText
    });
  });
});
