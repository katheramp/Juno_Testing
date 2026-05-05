module.exports = {
    header: {
        searchInput: "//header[@id='header']//input[@name='keyword']"
    },
    searchPage: {
        firstProductLink: "(//div[contains(@class, 'variant-name')]//a)[1]"
    },
    collectionPage: {
        filterBtn: "//button[@aria-label='Filter' or .//span[normalize-space()='Bộ lọc'] or normalize-space()='Bộ lọc']",
        filterCheckboxLabelByText: function (label) { return `//label[.//span[normalize-space()='${label}']]`; },
        filterCheckboxByText: function (label) { return `//label[.//span[normalize-space()='${label}']]//button[@role='checkbox']`; },
        filterColorLabel: function (colorName) { return `//li[contains(@title,'${colorName}')]//label | //label[.//span[normalize-space()='${colorName}']]`; },
        filterColorCheckbox: function (colorName) { return `//li[contains(@title,'${colorName}')]//button[@role='checkbox'] | //label[.//span[normalize-space()='${colorName}']]//button[@role='checkbox']`; },
        applyBtn: "//button[normalize-space()='Áp dụng']",
        productCards: "//div[contains(@class, 'w-product-card')]",
        productNameInCard: ".//div[contains(@class, 'variant-name')]",
        colorSwatchInCard: function (colorName) {
            const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase();
            return `.//img[@alt='${colorName.toLowerCase()}' or @alt='${colorName}' or @alt='${capitalizedColor}']`;
        }
    },
    detailPage: {
        buyBtn: "//div[@id='product-actions']//button[contains(., 'Mua')]"
    },
    miniCartDrawer: {
        viewCartBtn: "//div[@data-slot='drawer-content']//button[contains(., 'Xem giỏ hàng')]"
    },
    cartPage: {
        decreaseQtyBtn: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Decrease quantity'])[1]`; },
        qtyInput: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//input[@type='number'])[1]`; },
        increaseQtyBtn: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Increase quantity'])[1]`; },
        totalAmount: "//div[contains(@class, 'cart-actions')]//div[contains(@class, 'text-body-m') and contains(@class, 'text-black')]",
        cartEmptyMessage: ["//*[contains(text(),'Giỏ hàng của bạn còn trống')]", "//*[contains(text(),'Chưa có sản phẩm trong giỏ')]"]
    },
    addressPopup: {
        createAddressBtn: "//button[normalize-space()='Tạo địa chỉ' or .//*[normalize-space()='Tạo địa chỉ']]",
        createManualAddressBtn: "//button[normalize-space()='Tạo bằng cách nhập tay' or .//*[normalize-space()='Tạo bằng cách nhập tay']]",
        title: "//*[@data-popup='manual-address-create']//*[normalize-space()='Thêm địa chỉ mới'] | //*[normalize-space()='Thêm địa chỉ mới']",
        phoneInput: "//*[@data-popup='manual-address-create']//input[@placeholder='Số điện thoại' or @name='phone'] | //input[@placeholder='Số điện thoại' or @name='phone']",
        phoneError: "//*[@data-popup='manual-address-create']//*[normalize-space()='Vui lòng nhập số điện thoại hợp lệ']"
    }
};