module.exports = {
    header: {
        // 1. Logo trang web (Bấm vào để quay về trang chủ)
        logoBtn: "//header[@id='header']//img[@alt='Juno']/ancestor::a",

        // 2. Ô tìm kiếm sản phẩm trên Desktop
        searchInput: "//header[@id='header']//input[@name='keyword']",

        // 3. Nút mở ô tìm kiếm trên Mobile
        mobileSearchBtn: "//header[@id='header']//button[@title='Tìm kiếm' or @aria-label='Search']",

        // 4. Nút menu Hamburger trên Mobile
        mobileMenuBtn: "//header[@id='header']//button[@aria-label='mobile navbar icon']",

        // 5. Nút đi tới trang Đăng nhập / Tài khoản
        accountBtn: "//header[@id='header']//a[@href='/login' or @href='/account']",

        // 6. Nút mở trang Giỏ hàng
        cartBtn: "//header[@id='header']//a[@href='/cart']",

        // 7. Số lượng hiển thị trên icon Giỏ hàng
        cartBadgeCount: "//header[@id='header']//a[@href='/cart']//div[contains(@class, 'text-body-xs')]",

        // 8. Chọn 1 menu chính bất kỳ trên thanh điều hướng
        mainMenuLink: function (menuName) {
            return `//nav[@aria-label='Main']//a[contains(normalize-space(), '${menuName}')]`;
        },

        // 9. Chọn 1 menu phụ trong dropdown
        subMenuLink: function (subMenuName) {
            return `//header[@id='header']//div[contains(@class, 'absolute top-full')]//a[contains(normalize-space(), '${subMenuName}')]`;
        }
    },

    collectionPage: {
        // 1. Tiêu đề trang danh mục
        categoryTitle: "//main//h1",

        // 2. Nút mở Bộ lọc trên trang danh mục
        filterBtn: "//button[@aria-label='Filter' or .//span[normalize-space()='Bộ lọc'] or normalize-space()='Bộ lọc']",

        // 3. Khung Bộ lọc chứa các nhóm như Màu, Loại giày...
        filterPanel: "//div[.//span[normalize-space()='Màu'] and (.//span[normalize-space()='Loại giày'] or .//span[normalize-space()='Loại sản phẩm'])]",

        // 4. Lấy đúng thẻ label hiển thị của một ô filter theo text
        filterCheckboxLabelByText: function (label) {
            return `//label[.//span[normalize-space()='${label}']]`;
        },

        // 5. Lấy thẻ button role=checkbox ẩn bên trong label để check trạng thái aria-checked
        filterCheckboxByText: function (label) {
            return `//label[.//span[normalize-space()='${label}']]//button[@role='checkbox']`;
        },

        // 6. Lấy đúng ô màu hiển thị theo tên màu
        filterColorLabel: function (colorName) {
            const lowerColor = colorName.toLowerCase();
            return `//li[contains(@title,'${colorName}') or contains(@title,'${lowerColor}')]//label | //label[.//span[normalize-space()='${colorName}']]`;
        },

        // 7. Lấy button checkbox ẩn của filter màu để verify trạng thái
        filterColorCheckbox: function (colorName) {
            const lowerColor = colorName.toLowerCase();
            return `//li[contains(@title,'${colorName}') or contains(@title,'${lowerColor}')]//button[@role='checkbox'] | //label[.//span[normalize-space()='${colorName}']]//button[@role='checkbox']`;
        },

        // 8. Nút Áp dụng sau khi chọn xong filter
        applyBtn: "//button[normalize-space()='Áp dụng']",

        // 9. Toàn bộ card sản phẩm trên trang danh mục
        productCards: "//div[contains(@class, 'w-product-card')]",

        // 10. Link sản phẩm đầu tiên trong danh sách
        firstProductLink: "(//div[contains(@class, 'variant-name')]//a)[1]",

        // 11. Tên sản phẩm bên trong card
        productNameInCard: ".//div[contains(@class, 'variant-name')]",

        // 12. Lấy swatch / text màu trong card để verify sản phẩm vẫn có đúng màu mong muốn
        colorSwatchInCard: function (colorName) {
            const lowerColor = colorName.toLowerCase();
            return `.//*[@title='${lowerColor}' or @title='${colorName}' or @alt='${colorName}' or @data-color='${colorName}' or normalize-space()='${colorName}']`;
        }
    },

    detailPage: {
        // 1. Tên sản phẩm ở trang chi tiết
        productName: "//div[contains(@class, 'product-price')]/preceding-sibling::div",

        // 2. Giá khuyến mãi của sản phẩm
        productPrice: "//div[contains(@class, 'product-price')]//div[contains(@class, 'text-content-danger')]",

        // 3. Chọn đúng nút màu theo tên màu
        colorBtn: function (colorName) {
            return `//button[@data-color='${colorName}']`;
        },

        // 4. Nút Mua ở trang chi tiết
        buyBtn: "//div[@id='product-actions']//button[contains(., 'Mua')]"
    },

    miniCartDrawer: {
        // 1. Nút Xem giỏ hàng trong Mini Drawer
        viewCartBtn: "//div[@data-slot='drawer-content']//button[contains(., 'Xem giỏ hàng')]",

        // 2. Nút Đóng Mini Drawer
        closeBtn: "//div[@data-slot='drawer-content']//button[@aria-label='Đóng']",

        // 3. Tổng tiền tạm tính trong Mini Drawer
        totalPrice: "//div[@data-slot='drawer-content']//div[contains(text(), 'TỔNG TIỀN TẠM TÍNH')]/following-sibling::div"
    },

    cartPage: {
        // 1. Nút Tiến hành thanh toán ở trang Giỏ hàng
        checkoutBtn: "//button[contains(normalize-space(), 'TIẾN HÀNH THANH TOÁN') or contains(normalize-space(), 'Thanh toán') or contains(normalize-space(), 'THANH TOÁN')]"
    },

    addressPopup: {
        // 1. Nút Tạo địa chỉ ở popup rỗng / checkout
        createAddressBtn: "//button[normalize-space()='Tạo địa chỉ' or .//*[normalize-space()='Tạo địa chỉ']]",

        // 2. Nút Tạo bằng cách nhập tay
        createManualAddressBtn: "//button[normalize-space()='Tạo bằng cách nhập tay' or .//*[normalize-space()='Tạo bằng cách nhập tay']]",

        // 3. Toàn bộ popup Thêm địa chỉ mới
        modal: "//*[@data-popup='manual-address-create' or .//*[normalize-space()='Thêm địa chỉ mới']]",

        // 4. Tiêu đề popup Thêm địa chỉ mới
        title: "//*[@data-popup='manual-address-create']//*[normalize-space()='Thêm địa chỉ mới'] | //*[normalize-space()='Thêm địa chỉ mới']",

        // 5. Ô nhập Số điện thoại trong popup địa chỉ
        phoneInput: "//*[@data-popup='manual-address-create']//input[@placeholder='Số điện thoại' or @name='phone'] | //input[@placeholder='Số điện thoại' or @name='phone']",

        // 6. Nút Lưu trong popup địa chỉ
        saveBtn: "//*[@data-popup='manual-address-create']//button[normalize-space()='Lưu' or .//*[normalize-space()='Lưu']] | //button[normalize-space()='Lưu']",

        // 7. Dòng cảnh báo lỗi ngay bên dưới ô Số điện thoại
        phoneError: "//*[@data-popup='manual-address-create']//*[normalize-space()='Vui lòng nhập số điện thoại hợp lệ']"
    },

    common: {
        // 1. Toast message bất kỳ theo đúng nội dung kỳ vọng
        toastByMessage: function (expectedMessage) {
            return `//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title and contains(text(), '${expectedMessage}')]`;
        }
    }
};
