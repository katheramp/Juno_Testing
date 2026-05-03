module.exports = {
    homePage: {
        searchInput: "//input[@placeholder='Tìm sản phẩm']"
    },
    header: {
        // 1. Logo trang web (Bấm vào để về trang chủ)
        logoBtn: "//header[@id='header']//img[@alt='Juno']/ancestor::a",

        // 2. Ô nhập từ khóa tìm kiếm (Dành cho màn hình Desktop)
        searchInput: "//header[@id='header']//input[@name='keyword']",

        // 3. Nút mở form tìm kiếm trên Mobile (Bị ẩn trên màn hình lớn)
        mobileSearchBtn: "//header[@id='header']//button[@title='Tìm kiếm']",

        // 4. Icon Menu Hamburger (3 dấu gạch ngang) trên Mobile
        mobileMenuBtn: "//header[@id='header']//button[@aria-label='mobile navbar icon']",

        // 5. Nút đi tới trang Tài khoản
        accountBtn: "//header[@id='header']//a[@href='/account']",

        // 6. Nút mở Giỏ hàng (ở góc phải)
        cartBtn: "//header[@id='header']//a[@href='/cart']",

        // 7. Số lượng sản phẩm hiển thị trên icon Giỏ hàng (Dùng để verify số lượng mà không cần vào giỏ)
        cartBadgeCount: "//header[@id='header']//a[@href='/cart']//div[contains(@class, 'text-body-xs')]",

        // === CÁC HÀM XỬ LÝ MENU DÙNG CHUNG ===

        // 8. Chọn một menu chính bất kỳ trên thanh điều hướng ngang (Ví dụ: "Hàng mới", "Sản phẩm", "Showroom")
        mainMenuLink: function (menuName) {
            return `//nav[@aria-label='Main']//a[contains(., '${menuName}')]`;
        },

        // 9. Chọn một menu phụ (Dropdown) bất kỳ khi hover vào menu chính 
        // (Ví dụ: "Giày cao gót", "Túi cỡ trung", "Mắt kính")
        subMenuLink: function (subMenuName) {
            return `//header[@id='header']//div[contains(@class, 'absolute top-full')]//a[contains(., '${subMenuName}')]`;
        }
    },
    searchPage: {
        // 1. Lấy tên/link của sản phẩm đầu tiên (Click vào đây là an toàn nhất để vào trang chi tiết)
        firstProductLink: "(//div[contains(@class, 'variant-name')]//a)[1]",

        // 2. Lấy toàn bộ khung (card) của sản phẩm đầu tiên (Dùng nếu test case yêu cầu hover chuột vào card)
        firstProductCard: "(//div[contains(@class, 'w-product-card')])[1]",

        // 3. Lấy giá bán của sản phẩm đầu tiên (Dùng để lấy text verify giá trước khi click)
        firstProductPrice: "(//div[contains(@class, 'w-product-card')])[1]//div[contains(@class, 'variant-price')]/div[1]"
    },
    detailPage: {
        // 1. Tên sản phẩm: Tìm thằng class 'product-price' rồi lấy thằng anh em đứng ngay trên nó
        productName: "//div[contains(@class, 'product-price')]/preceding-sibling::div",

        // 2. Giá khuyến mãi (màu đỏ): Nằm gọn trong 'product-price'
        productPrice: "//div[contains(@class, 'product-price')]//div[contains(@class, 'text-content-danger')]",

        // 3. Giá gốc (bị gạch ngang - nếu test case có yêu cầu check)
        originalPrice: "//div[contains(@class, 'product-price')]//div[contains(@class, 'line-through')]",

        // 4. Chọn màu sắc (Dùng hàm truyền tên màu vào, siêu xịn!)
        // Ví dụ: locators.detailPage.colorBtn('Hồng')
        colorBtn: function (colorName) {
            return `//button[@data-color='${colorName}']`;
        },
        buyBtn: "//div[@id='product-actions']//button[contains(., 'Mua')]",
        // 5. Nút Tăng / Giảm số lượng
        increaseQtyBtn: "//div[@id='product-actions']//button[@aria-label='Increase quantity']",
        decreaseQtyBtn: "//div[@id='product-actions']//button[@aria-label='Decrease quantity']",

        // 6. Ô nhập số lượng
        qtyInput: "//div[@id='product-actions']//input[@type='number']",
    },
    miniCartDrawer: {
        // 1. Nút "Xem giỏ hàng" bên trong Drawer
        viewCartBtn: "//div[@data-slot='drawer-content']//button[contains(., 'Xem giỏ hàng')]",

        // 2. Nút "X" (Đóng) ở góc trên
        closeBtn: "//div[@data-slot='drawer-content']//button[@aria-label='Đóng']",

        // 3. Tổng tiền tạm tính (Dùng để Validate giá xem có đúng không)
        totalPrice: "//div[@data-slot='drawer-content']//div[contains(text(), 'TỔNG TIỀN TẠM TÍNH')]/following-sibling::div",

        // 4. Số lượng sản phẩm đang có trong giỏ
        itemCount: "//div[@data-slot='drawer-content']//div[contains(@class, 'inline') and text() > 0]"
    },

    cartPage: {
        // 1. Nút "Chọn tất cả" sản phẩm
        selectAllCheckbox: "//button[@id='select-all']",

        // === CÁC HÀM XỬ LÝ THEO TỪNG SẢN PHẨM CỤ THỂ ===
        // Logic siêu bền: Tìm text -> Lên cha gần nhất CÓ CHỨA input số lượng -> Lấy phần tử cần tương tác

        // 2. Lấy ô Checkbox của một sản phẩm
        productCheckbox: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@role='checkbox'])[1]`;
        },

        // 3. Lấy Giá bán hiện tại (Màu đỏ)
        productPrice: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//div[contains(@class, 'text-content-danger')])[1]`;
        },

        // 4. Lấy nút Giảm số lượng (-)
        decreaseQtyBtn: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Decrease quantity'])[1]`;
        },

        // 5. Ô nhập số lượng
        qtyInput: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//input[@type='number'])[1]`;
        },

        // 6. Lấy nút Tăng số lượng (+)
        increaseQtyBtn: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//button[@aria-label='Increase quantity'])[1]`;
        },

        // 7. Lấy nút Xóa (Biểu tượng thùng rác)
        deleteBtn: function (productName) {
            return `(//*[contains(text(), '${productName}')]/ancestor::div[.//input[@type='number']][1]//div[contains(@class, 'min-h-9')]//button)[1]`;
        },

        // === BLOCK THANH TOÁN (BÊN PHẢI/DƯỚI) ===
        // 8. Tổng tiền tạm tính
        totalAmount: "//div[contains(@class, 'cart-actions')]//div[contains(@class, 'text-body-m') and contains(@class, 'text-black')]",

        // 9. Số tiền tiết kiệm được
        savedAmount: "//div[contains(@class, 'cart-actions')]//div[contains(@class, 'text-content-safe')]",

        // 10. Nút "Thanh toán"
        checkoutBtn: "//div[contains(@class, 'cart-actions')]//button[contains(., 'Thanh toán')]"
    },
    common: {
        // 1. Lấy text của Toast Notification bất kỳ đang hiển thị (Dùng để getText và so sánh)
        activeToastMessage: "//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title]",

        // 2. Đợi một Toast chứa đoạn text mong muốn (Dùng chung cho mọi thông báo: thành công, thất bại, hết hàng...)
        toastByMessage: function (expectedMessage) {
            return `//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title and contains(text(), '${expectedMessage}')]`;
        },

        // 3. Chuyên dùng cho case Hết hàng (Truyền tên sản phẩm vào)
        outOfStockToast: function (productName) {
            return `//ol[@data-sonner-toaster='true']//li[@data-sonner-toast]//div[@data-title and contains(text(), 'Sản phẩm ${productName} đã hết hàng')]`;
        }
    }

}