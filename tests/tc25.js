const { expect } = require('chai');
const testData = require('../data/data.json');
const {
  addProductToCart,
  addTestMeta,
  captureScreen,
  clearCart,
  createChromeDriver,
  formatReportTime,
  getDisplayedCount,
  removeTempChromeProfile,
  tryReadText,
  updateQuantity,
  waitForCartStable
} = require('../functions/helpers');
const { LOCATORS } = require('../functions/locators');

const TESTER_NAME = 'Đào Huỳnh Gia Hân - 81012302863';
const tc25Data = testData.find(item => item.testcase === 'TC25');

if (!tc25Data) {
  throw new Error('Không tìm thấy dữ liệu TC25 trong data/data.json');
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs))
  ]);
}

// TC25 pass khi item biến mất hoặc giỏ hiển thị trạng thái trống.
function validateTC25({ itemCountAfterUpdate, quantityInputsAfterUpdate, emptyMessage }) {
  const isRemoved = itemCountAfterUpdate === 0 && quantityInputsAfterUpdate === 0;
  const hasEmptyMessage = Boolean(emptyMessage);
  expect(isRemoved || hasEmptyMessage).to.equal(
    true,
    `Giỏ hàng chưa trống sau khi cập nhật về 0. itemCount=${itemCountAfterUpdate}, quantityInputs=${quantityInputsAfterUpdate}, emptyMessage=${emptyMessage || '<empty>'}`
  );
}

describe(`${tc25Data.testcase}: ${tc25Data.testcasename}`, function () {
  this.timeout(240000);
  this.retries(1);
  let driver;

  before(async function () {
    driver = await createChromeDriver();
    addTestMeta(this, `Tester: ${TESTER_NAME}`);
    addTestMeta(this, `Requirement: ${tc25Data.requirement}`);
    addTestMeta(this, `Expected: ${tc25Data.expected}`);
    addTestMeta(this, `Product URL: ${tc25Data.productUrl || tc25Data.url}`);
  });

  beforeEach(function () {
    addTestMeta(this, `Tester: ${TESTER_NAME}`);
    addTestMeta(this, `Start Time: ${formatReportTime(new Date())}`);
    addTestMeta(this, 'Evidence: Screenshot after test execution.');
  });

  afterEach(async function () {
    try {
      await withTimeout(
        captureScreen(driver, this, `${tc25Data.testcase}_${this.currentTest.title}`, this.currentTest.state),
        20000,
        'Timeout khi chụp screenshot TC25'
      );
    } catch (error) {
      // Không làm fail hook chỉ vì screenshot bị treo.
    }
    addTestMeta(this, `End Time: ${formatReportTime(new Date())}`);
  });

  after(async function () {
    if (driver) {
      try {
        await withTimeout(driver.quit(), 20000, 'Timeout khi đóng trình duyệt TC25');
      } catch (error) {
        // Bỏ qua lỗi đóng browser để không treo toàn bộ run.
      } finally {
        removeTempChromeProfile(driver);
      }
    }
  });

  it('Giảm số lượng về 0 thì sản phẩm bị xóa khỏi giỏ', async function () {
    await clearCart(driver);
    await addProductToCart(driver, tc25Data.productUrl || tc25Data.url, LOCATORS);
    await waitForCartStable(driver, LOCATORS);

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
  });
});
