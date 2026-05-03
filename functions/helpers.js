const fs = require('fs');
const os = require('os');
const path = require('path');
const { Builder, By, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addContext = require('mochawesome/addContext');

function formatReportTime(date = new Date()) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

function addTestMeta(testContext, message) {
  addContext(testContext, message);
}

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function resolveChromeBinaryPath() {
  const candidates = [
    process.env.CHROME_BINARY_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  const found = candidates.find(candidate => candidate && fs.existsSync(candidate));
  if (!found) {
    throw new Error('Không tìm thấy chrome.exe. Hãy cài Google Chrome hoặc đặt CHROME_BINARY_PATH.');
  }
  return found;
}

function resolveChromeDriverPath() {
  if (process.env.CHROMEDRIVER_PATH && fs.existsSync(process.env.CHROMEDRIVER_PATH)) {
    return process.env.CHROMEDRIVER_PATH;
  }
  const cacheRoot = path.join(os.homedir(), '.cache', 'selenium', 'chromedriver', 'win64');
  if (!fs.existsSync(cacheRoot)) {
    throw new Error('Không tìm thấy chromedriver. Hãy đặt biến CHROMEDRIVER_PATH.');
  }

  const versions = fs
    .readdirSync(cacheRoot, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .sort((a, b) => {
      const left = a.split('.').map(part => Number(part) || 0);
      const right = b.split('.').map(part => Number(part) || 0);
      const len = Math.max(left.length, right.length);
      for (let i = 0; i < len; i += 1) {
        const diff = (right[i] || 0) - (left[i] || 0);
        if (diff !== 0) {
          return diff;
        }
      }
      return 0;
    });

  for (const version of versions) {
    const candidate = path.join(cacheRoot, version, 'chromedriver.exe');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('Không tìm thấy chromedriver.exe hợp lệ.');
}

function createChromeDriver() {
  const options = new chrome.Options()
    .setChromeBinaryPath(resolveChromeBinaryPath())
    .addArguments(
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-sandbox',
      '--window-size=1400,1200'
    );

  if (String(process.env.HEADLESS || 'true').toLowerCase() !== 'false') {
    options.addArguments('--headless=new');
  }

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(resolveChromeDriverPath()))
    .build();
}

async function findFirstDisplayed(driver, xpathList, timeout = 7000) {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    for (const xpath of xpathList) {
      const elements = await driver.findElements(By.xpath(xpath));
      for (const element of elements) {
        try {
          if (await element.isDisplayed()) {
            return element;
          }
        } catch (error) {
          // Bỏ qua phần tử stale trong lúc trang cập nhật.
        }
      }
    }
    await driver.sleep(250);
  }
  throw new Error(`Không tìm thấy phần tử hiển thị với XPath: ${xpathList.join(' | ')}`);
}

async function getDisplayedCount(driver, xpathList) {
  for (const xpath of xpathList) {
    const elements = await driver.findElements(By.xpath(xpath));
    let count = 0;
    for (const element of elements) {
      try {
        if (await element.isDisplayed()) {
          count += 1;
        }
      } catch (error) {
        // Bỏ qua stale element.
      }
    }
    if (count > 0) {
      return count;
    }
  }
  return 0;
}

async function tryReadText(driver, xpathList) {
  for (const xpath of xpathList) {
    const elements = await driver.findElements(By.xpath(xpath));
    for (const element of elements) {
      try {
        if (await element.isDisplayed()) {
          const text = (await element.getText() || '').trim();
          if (text) {
            return text;
          }
        }
      } catch (error) {
        // Bỏ qua stale element.
      }
    }
  }
  return '';
}

function parseCurrency(text) {
  const normalized = String(text || '').replace(/[^\d]/g, '');
  return normalized ? Number(normalized) : 0;
}

async function getCartSummarySnapshot(driver) {
  return driver.executeScript(`
    const normalizeNumber = (text) => {
      const digits = String(text || '').replace(/[^\\d]/g, '');
      return digits ? Number(digits) : 0;
    };

    const summaryNode = [...document.querySelectorAll('body *')]
      .find((node) => /Tạm tính/i.test((node.innerText || node.textContent || '').trim()));

    const summaryText = summaryNode
      ? (summaryNode.innerText || summaryNode.textContent || '').trim().replace(/\\s+/g, ' ')
      : '';

    let subtotalText = '';
    if (summaryNode) {
      const container = summaryNode.closest('.cart-summary, .summary, .cart-right, .sidebar, .total') || summaryNode.parentElement;
      if (container) {
        const raw = (container.innerText || container.textContent || '').replace(/\\s+/g, ' ');
        const match = raw.match(/\\d{1,3}(?:[\\.,]\\d{3})+\\s*đ/i);
        subtotalText = match ? match[0] : '';
      }
    }

    if (!subtotalText) {
      const fallbackText = [...document.querySelectorAll('.total-price, .cart-total, .summary, .cart-right')]
        .map((node) => (node.innerText || node.textContent || '').replace(/\\s+/g, ' '))
        .join(' ');
      const match = fallbackText.match(/\\d{1,3}(?:[\\.,]\\d{3})+\\s*đ/i);
      subtotalText = match ? match[0] : '';
    }

    return {
      summaryText,
      subtotalText,
      subtotalValue: normalizeNumber(subtotalText)
    };
  `);
}

async function clickElement(driver, element) {
  try {
    await element.click();
  } catch (error) {
    await driver.executeScript('arguments[0].click()', element);
  }
}

async function clickRemoveConfirmAction(driver, timeout = 4000) {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    const removeUrl = await driver.executeScript(`
      const candidates = [
        ...document.querySelectorAll('a.removePro'),
        ...document.querySelectorAll('a[href*="/cart/change"][href*="quantity=0"]'),
        ...document.querySelectorAll('.modal-fotter a, .modal-footer a')
      ];
      const target = candidates.find((element) => {
        const href = element.href || element.getAttribute('href') || '';
        return href.includes('/cart/change') && href.includes('quantity=0');
      }) || candidates.find((element) => (element.href || element.getAttribute('href') || '').trim());
      return target ? (target.href || target.getAttribute('href') || '') : '';
    `);

    if (removeUrl) {
      await driver.get(removeUrl);
      await driver.sleep(1500);
      return true;
    }
    await driver.sleep(250);
  }
  return false;
}

async function clickVisibleTextAction(driver, textCandidates = [], timeout = 4000) {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    const clicked = await driver.executeScript(`
      const texts = arguments[0];
      const elements = [...document.querySelectorAll('button, a, span, div')];
      for (const text of texts) {
        const target = elements.find((element) => (element.innerText || element.textContent || '').trim() === text);
        if (target) {
          target.click();
          return true;
        }
      }
      return false;
    `, textCandidates);

    if (clicked) {
      await driver.sleep(1000);
      return true;
    }
    await driver.sleep(250);
  }
  return false;
}

// Cập nhật số lượng bằng nút cộng/trừ để khớp hành vi giỏ hàng thực tế.
async function updateQuantity(driver, locators, targetQuantity) {
  const quantityInput = await findFirstDisplayed(driver, locators.quantityInputs, 10000);
  const currentValue = Number(await quantityInput.getAttribute('value')) || 1;
  const targetValue = Number(targetQuantity);

  if (targetValue === 0) {
    let clickedNearInput = false;
    try {
      clickedNearInput = await driver.executeScript(`
        const input = arguments[0];
        const root = input.closest('tr, .line-item, .cart-item, .quantity, form') || input.parentElement;
        if (!root) return false;
        const candidates = [...root.querySelectorAll('button, a, span')];
        const target = candidates.find((element) => {
          const text = (element.innerText || element.textContent || '').trim();
          const className = String(element.className || '');
          return text === '-' || /qtyminus|minus/i.test(className);
        });
        if (!target) return false;
        target.click();
        return true;
      `, quantityInput);
    } catch (error) {
      clickedNearInput = false;
    }

    if (!clickedNearInput) {
      const decrementButton = await findFirstDisplayed(driver, locators.decrementButtons, 5000);
      await clickElement(driver, decrementButton);
    }

    await driver.sleep(1000);
    let confirmed = await clickRemoveConfirmAction(driver, 4000);
    if (!confirmed && locators.confirmDeleteButtons?.length) {
      try {
        const confirmButton = await findFirstDisplayed(driver, locators.confirmDeleteButtons, 3000);
        await clickElement(driver, confirmButton);
        confirmed = true;
      } catch (error) {
        confirmed = false;
      }
    }
    if (!confirmed) {
      await clickVisibleTextAction(driver, ['Có', 'CO', 'Yes'], 3000);
    }
    await driver.sleep(1500);
    return null;
  }

  if (currentValue < targetValue) {
    const plusButton = await findFirstDisplayed(driver, locators.incrementButtons, 5000);
    for (let value = currentValue; value < targetValue; value += 1) {
      await clickElement(driver, plusButton);
      await driver.sleep(700);
    }
  } else if (currentValue > targetValue) {
    const minusButton = await findFirstDisplayed(driver, locators.decrementButtons, 5000);
    for (let value = currentValue; value > targetValue; value -= 1) {
      await clickElement(driver, minusButton);
      await driver.sleep(700);
    }
  } else {
    await quantityInput.click();
    await quantityInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await quantityInput.sendKeys(String(targetValue), Key.TAB);
    try {
      const updateButton = await findFirstDisplayed(driver, locators.updateButtons, 2000);
      await clickElement(driver, updateButton);
    } catch (error) {
      // Một số giao diện tự cập nhật khi blur.
    }
  }

  await driver.sleep(2000);
  return quantityInput;
}

async function addProductToCart(driver, productUrl, locators) {
  await driver.get(productUrl);
  await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', 15000);
  await driver.sleep(1200);

  try {
    const sizeOption = await findFirstDisplayed(driver, locators.productSizeOptions, 5000);
    await clickElement(driver, sizeOption);
    await driver.sleep(600);
  } catch (error) {
    // Một số sản phẩm không có size.
  }

  try {
    const colorOption = await findFirstDisplayed(driver, locators.productColorOptions, 2500);
    await clickElement(driver, colorOption);
    await driver.sleep(600);
  } catch (error) {
    // Một số sản phẩm không cần chọn màu.
  }

  const buyButton = await findFirstDisplayed(driver, locators.buyButtons, 10000);
  await clickElement(driver, buyButton);
  await driver.sleep(2000);

  try {
    const confirmButton = await findFirstDisplayed(driver, locators.confirmProductOptionButtons, 3000);
    await clickElement(driver, confirmButton);
    await driver.sleep(1200);
  } catch (error) {
    // Không có popup xác nhận thì bỏ qua.
  }

  try {
    const viewCartButton = await findFirstDisplayed(driver, locators.viewCartButtons, 8000);
    await clickElement(driver, viewCartButton);
  } catch (error) {
    const cartLink = await findFirstDisplayed(driver, locators.cartNavigationLinks, 5000);
    await clickElement(driver, cartLink);
  }

  await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', 15000);
  await driver.sleep(1200);
}

// Chờ dữ liệu giỏ hàng hiển thị ổn định trước khi chụp ảnh evidence.
async function waitForCartStable(driver, locators, timeout = 12000) {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    const hasQuantity = await getDisplayedCount(driver, locators.quantityInputs);
    const totalText = await tryReadText(driver, locators.totalPrice);
    if (hasQuantity > 0 && totalText) {
      await driver.sleep(600);
      return true;
    }
    await driver.sleep(300);
  }
  return false;
}

// Dọn giỏ hàng trước mỗi test để dữ liệu luôn ổn định.
async function clearCart(driver) {
  try {
    await driver.get('https://sales.juno.vn/cart');
    await driver.wait(async () => (await driver.executeScript('return document.readyState')) === 'complete', 15000);
    await driver.sleep(1000);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const removed = await driver.executeScript(`
        const removeLink = document.querySelector('a.removePro, a[href*="/cart/change"][href*="quantity=0"]');
        if (!removeLink) return false;
        const href = removeLink.href || removeLink.getAttribute('href') || '';
        if (!href) return false;
        window.location.href = href;
        return true;
      `);
      if (!removed) {
        break;
      }
      await driver.sleep(1500);
    }
  } catch (error) {
    // Không chặn test nếu không dọn được giỏ, bước thêm sản phẩm vẫn chạy.
  }
}

async function dismissBlockingOverlays(driver) {
  await driver.executeScript(`
    const selectors = ['.modal-backdrop', '.modal', '.popup', '.fancybox-overlay', '.fancybox-wrap', '[role="dialog"]'];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        node.style.display = 'none';
        node.style.visibility = 'hidden';
        node.style.opacity = '0';
      });
    });
    document.body.classList.remove('modal-open');
  `);
}

async function captureEvidence(driver, testContext, options = {}) {
  const reportDir = path.join(process.cwd(), 'mochawesome-report');
  const screenshotDir = path.join(reportDir, 'screenshots');
  ensureDirectory(screenshotDir);

  const fileName = options.fileName || `screenshot_${Date.now()}.png`;
  const fullPath = path.join(screenshotDir, fileName);

  await dismissBlockingOverlays(driver);

  const highlightedElements = [];
  if (options.highlightXpaths?.length) {
    for (const xpath of options.highlightXpaths) {
      try {
        const element = await findFirstDisplayed(driver, [xpath], 2000);
        highlightedElements.push(element);
      } catch (error) {
        // Bỏ qua XPath không tìm thấy để vẫn chụp được evidence.
      }
    }

    if (highlightedElements.length) {
      try {
        await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "center" });', highlightedElements[0]);
      } catch (error) {
        // Không chặn luồng chụp ảnh nếu cuộn thất bại.
      }

      await driver.executeScript(`
        const targets = arguments[0] || [];
        targets.forEach((target) => {
          const tag = String(target.tagName || '').toLowerCase();
          const wrapper = ['button', 'a', 'span', 'div'].includes(tag)
            ? target
            : (target.closest('td, .quantity-partent, .quantity, .qty-click, .cart_qty, .cart-qty, .item-qty, tr') || target);
          wrapper.dataset.originalOutline = wrapper.style.outline || '';
          wrapper.style.outline = '4px solid #ff0000';
        });
      `, highlightedElements);
      await driver.sleep(500);
    }
  }

  const image = await driver.takeScreenshot();
  fs.writeFileSync(fullPath, image, 'base64');

  if (highlightedElements.length) {
    await driver.executeScript(`
      const targets = arguments[0] || [];
      targets.forEach((target) => {
        const tag = String(target.tagName || '').toLowerCase();
        const wrapper = ['button', 'a', 'span', 'div'].includes(tag)
          ? target
          : (target.closest('td, .quantity-partent, .quantity, .qty-click, .cart_qty, .cart-qty, .item-qty, tr') || target);
        wrapper.style.outline = wrapper.dataset.originalOutline || '';
        delete wrapper.dataset.originalOutline;
      });
    `, highlightedElements);
  }

  addContext(testContext, `screenshots/${fileName}`);
}

module.exports = {
  addProductToCart,
  addTestMeta,
  captureEvidence,
  clearCart,
  createChromeDriver,
  formatReportTime,
  getDisplayedCount,
  parseCurrency,
  getCartSummarySnapshot,
  tryReadText,
  updateQuantity,
  waitForCartStable
};
