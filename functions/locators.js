module.exports = {
    homePage: {
        searchInput: "//input[@placeholder='Tìm sản phẩm']"
    },
    header: {
        logoBtn: "//header[@id='header']//img[@alt='Juno']/ancestor::a",
        searchInput: "//header[@id='header']//input[@name='keyword']",
        mobileSearchBtn: "//header[@id='header']//button[@title='Tìm kiếm' or @aria-label='Search']",
        mobileMenuBtn: "//header[@id='header']//button[@aria-label='mobile navbar icon']",
        accountBtn: "//header[@id='header']//a[@href='/account']",
        cartBtn: "//header[@id='header']//a[@href='/cart']",
        cartBadgeCount: "//header[@id='header']//a[@href='/cart']//div[contains(@class, 'text-body-xs')]",
        mainMenuLink: function (menuName) { return `//nav[@aria-label='Main']//a[contains(., '${menuName}')]`; },
        subMenuLink: function (subMenuName) { return `//header[@id='header']//div[contains(@class, 'absolute top-full')]//a[contains(., '${subMenuName}')]`; },
        cartNavigationLinks: [
            "//a[contains(@class,'count-holder') and contains(@href,'/cart')]",
            "//a[@href='/cart']"
        ]
    },
    searchPage: {
        firstProductLink: "(//div[contains(@class, 'variant-name')]//a)[1]",
        firstProductCard: "(//div[contains(@class, 'w-product-card')])[1]",
        firstProductPrice: "(//div[contains(@class, 'w-product-card')])[1]//div[contains(@class, 'variant-price')]/div[1]"
    },
    collectionPage: {
        categoryTitle: "//main//h1",
        filterBtn: "//button[@aria-label='Filter' or .//span[normalize-space()='Bộ lọc'] or normalize-space()='Bộ lọc']",
        filterPanel: "//div[.//span[normalize-space()='Màu'] and (.//span[normalize-space()='Loại giày'] or .//span[normalize-space()='Loại sản phẩm'])]",
        filterCheckboxLabelByText: function (label) { return `//label[.//span[normalize-space()='${label}']]`; },
        filterCheckboxByText: function (label) { return `//label[.//span[normalize-space()='${label}']]//button[@role='checkbox']`; },
        filterColorLabel: function (colorName) { return `//li[contains(@title,'${colorName}')]//label | //label[.//span[normalize-space()='${colorName}']]`; },
        filterColorCheckbox: function (colorName) { return `//li[contains(@title,'${colorName}')]//button[@role='checkbox'] | //label[.//span[normalize-space()='${colorName}']]//button[@role='checkbox']`; },
        applyBtn: "//button[normalize-space()='Áp dụng']",
        productCards: "//div[contains(@class, 'w-product-card')]",
        firstProductLink: "(//div[contains(@class, 'variant-name')]//a)[1]",
        productNameInCard: ".//div[contains(@class, 'variant-name')]",
        colorSwatchInCard: function (colorName) { return `.//*[@title='${colorName.toLowerCase()}' or @title='${colorName}']`; }
    },
    detailPage: {
        productName: "//div[contains(@class, 'product-price')]/preceding-sibling::div",
        productPrice: "//div[contains(@class, 'product-price')]//div[contains(@class, 'text-content-danger')]",
        originalPrice: "//div[contains(@class, 'product-price')]//div[contains(@class, 'line-through')]",
        colorBtn: function (colorName) { return `//button[@data-color='${colorName}']`; },
        buyBtn: "//div[@id='product-actions']//button[contains(., 'Mua')]",
        increaseQtyBtn: "//div[@id='product-actions']//button[@aria-label='Increase quantity']",
        decreaseQtyBtn: "//div[@id='product-actions']//button[@aria-label='Decrease quantity']",
        qtyInput: "//div[@id='product-actions']//input[@type='number']",
        productSizeOptions: [
            "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[normalize-space()='35']",
            "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[normalize-space()='36']",
            "(//*[contains(@class,'swatch-element') and not(contains(@class,'color')) and not(contains(@class,'soldout'))])[1]"
        ],
        productColorOptions: ["(//*[contains(@class,'swatch-element') and contains(@class,'color') and not(contains(@class,'soldout'))])[1]"],
        buyButtons: ["//*[@id='add-to-cart']", "//button[contains(.,'MUA')]"]
    },
    miniCartDrawer: {
        viewCartBtn: "//div[@data-slot='drawer-content']//button[contains(., 'Xem giỏ hàng')]",
        closeBtn: "//div[@data-slot='drawer-content']//button[@aria-label='Đóng']",
        totalPrice: "//div[@data-slot='drawer-content']//div[contains(text(), 'TỔNG TIỀN TẠM TÍNH')]/following-sibling::div",
        itemCount: "//div[@data-slot='drawer-content']//div[contains(@class, 'inline') and text() > 0]",
        viewCartButtons: ["//a[contains(@href,'/cart')]", "//button[contains(normalize-space(.),'XEM GIỎ HÀNG')]"]
    },
    cartPage: {
        selectAllCheckbox: "//button[@id='select-all']",
        productCheckbox: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@role='checkbox'])[1]`; },
        productPrice: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//div[contains(@class, 'text-content-danger')])[1]`; },
        decreaseQtyBtn: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Decrease quantity'])[1]`; },
        qtyInput: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//input[@type='number'])[1]`; },
        increaseQtyBtn: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Increase quantity'])[1]`; },
        deleteBtn: function (productName) { return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//div[contains(@class, 'min-h-9')]//button)[1]`; },
        totalAmount: "//div[contains(@class, 'cart-actions')]//div[contains(@class, 'text-body-m') and contains(@class, 'text-black')]",
        savedAmount: "//div[contains(@class, 'cart-actions')]//div[contains(@class, 'text-content-safe')]",
        checkoutBtn: "//div[contains(@class, 'cart-actions')]//button[contains(., 'Thanh toán')]",
        cartItems: ["//tr[contains(@class,'line-item-container')]", "//*[contains(@class,'line-item')]"],
        quantityInputs: ["(//tr[contains(@class,'line-item-container')]//input[not(@type='hidden')])[1]", "(//*[contains(@class,'line-item')]//input[not(@type='hidden')])[1]"],
        incrementButtons: ["//button[@aria-label='Increase quantity']", "(//*[normalize-space()='+'])[1]"],
        decrementButtons: ["//button[@aria-label='Decrease quantity']", "(//*[normalize-space()='-'])[1]"],
        confirmDeleteButtons: ["//*[normalize-space()='Có']", "//*[@role='dialog']//*[normalize-space()='Yes' or normalize-space()='OK']"],
        updateButtons: ["(//button[normalize-space()='Cập nhật'])[1]"],
        totalPriceList: ["(//div[@class='text-body-m font-semibold text-black'])[1]", "(//*[contains(normalize-space(),'Tổng tiền:')]/ancestor::*//*[contains(normalize-space(),'đ')])[1]"],
        cartEmptyMessage: ["//*[contains(text(),'Giỏ hàng của bạn còn trống')]", "//*[contains(text(),'Chưa có sản phẩm trong giỏ')]"],
        cartEvidenceContainers: ["(//tr[contains(@class,'line-item-container')])[1]"],
        emptyCartEvidenceContainers: ["//*[contains(text(),'Giỏ hàng của bạn còn trống')]/ancestor::div[1]"]
    },
    addressPopup: {
        createAddressBtn: "//button[normalize-space()='Tạo địa chỉ' or .//*[normalize-space()='Tạo địa chỉ']]",
        createManualAddressBtn: "//button[normalize-space()='Tạo bằng cách nhập tay' or .//*[normalize-space()='Tạo bằng cách nhập tay']]",
        modal: "//*[@data-popup='manual-address-create' or .//*[normalize-space()='Thêm địa chỉ mới']]",
        title: "//*[@data-popup='manual-address-create']//*[normalize-space()='Thêm địa chỉ mới'] | //*[normalize-space()='Thêm địa chỉ mới']",
        phoneInput: "//*[@data-popup='manual-address-create']//input[@placeholder='Số điện thoại' or @name='phone'] | //input[@placeholder='Số điện thoại' or @name='phone']",
        saveBtn: "//*[@data-popup='manual-address-create']//button[normalize-space()='Lưu' or .//*[normalize-space()='Lưu']] | //button[normalize-space()='Lưu']",
        phoneError: "//*[@data-popup='manual-address-create']//*[normalize-space()='Vui lòng nhập số điện thoại hợp lệ']"
    },
    common: {
        activeToastMessage: "//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title]",
        toastByMessage: function (expectedMessage) { return `//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title and contains(text(), '${expectedMessage}')]`; },
        outOfStockToast: function (productName) { return `//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title and contains(text(), 'Sản phẩm ${productName} đã hết hàng')]`; },
        confirmProductOptionButtons: ["//*[self::button or self::a][normalize-space()='OK']"]
    }
}