const LOCATORS = {
  productSizeOptions: [
    "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span][normalize-space()='35']",
    "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span][normalize-space()='36']",
    "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span][normalize-space()='37']",
    "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span][normalize-space()='38']",
    "//*[@class='swatch-element' and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span][normalize-space()='39']",
    "(//*[contains(@class,'swatch-element') and not(contains(@class,'color')) and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span])[1]"
  ],
  productColorOptions: [
    "(//*[contains(@class,'swatch-element') and contains(@class,'color') and not(contains(@class,'soldout'))]//*[self::label or self::button or self::span])[1]"
  ],
  confirmProductOptionButtons: [
    "//*[self::button or self::a][normalize-space()='OK']",
    "//*[self::button or self::a][contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'OK')]"
  ],
  buyButtons: [
    "//*[@id='add-to-cart']",
    "//button[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'MUA NGAY')]",
    "//button[contains(.,'MUA')]"
  ],
  viewCartButtons: [
    "//a[contains(@class,'linktocheckout') and contains(@href,'/cart')]",
    "//a[contains(translate(normalize-space(.), 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'XEM GIỎ HÀNG')]",
    "//button[normalize-space()='XEM GIỎ HÀNG']"
  ],
  cartNavigationLinks: [
    "//a[contains(@class,'count-holder') and contains(@href,'/cart')]",
    "//a[@href='/cart']"
  ],
  cartItems: [
    "//tr[contains(@class,'line-item-container')]",
    "//*[contains(@class,'line-item') and .//input[contains(@name,'updates') or contains(@class,'quantity') or contains(@class,'qty')]]"
  ],
  quantityInputs: [
    "(//tr[contains(@class,'line-item-container')]//input[not(@type='hidden') and (contains(@name,'updates') or contains(@class,'quantity') or contains(@class,'qty'))])[1]",
    "(//*[contains(@class,'line-item')]//input[not(@type='hidden') and (contains(@name,'updates') or contains(@class,'quantity') or contains(@class,'qty'))])[1]"
  ],
  incrementButtons: [
    "//button[@aria-label='Increase quantity']",
    "(//button[contains(@class,'qtyplus')])[1]",
    "(//button[contains(@class,'plus') and not(contains(@class,'disabled'))])[1]",
    "(//*[self::button or self::a or self::span][normalize-space()='+'])[1]"
  ],
  decrementButtons: [
    "//button[@aria-label='Decrease quantity']",
    "(//button[contains(@class,'qtyminus')])[1]",
    "(//button[contains(@class,'minus') and not(contains(@class,'disabled'))])[1]",
    "(//*[self::button or self::a or self::span][normalize-space()='-'])[1]",
    "(//tr[contains(@class,'line-item-container')]//*[self::button or self::a or self::span][contains(@class,'qtyminus') or contains(@class,'minus') or normalize-space()='-'])[1]"
  ],
  confirmDeleteButtons: [
    "//*[self::button or self::a or self::span][normalize-space()='Có']",
    "//*[self::button or self::a][contains(@class,'btn') and normalize-space()='Có']"
  ],
  updateButtons: [
    "(//button[normalize-space()='Cập nhật'])[1]",
    "(//button[contains(.,'Cập nhật giỏ hàng')])[1]",
    "(//button[contains(@class,'update') or contains(@name,'update')])[1]"
  ],
  totalPrice: [
    "(//div[@class='text-body-m font-semibold text-black'])[1]",
    "(//*[contains(normalize-space(),'Tổng tiền:')]/ancestor::*[self::li or self::div][1]//*[contains(normalize-space(),'đ')])[1]",
    "(//*[contains(text(),'Tổng tiền')]/following::*[contains(normalize-space(),'đ')][1])[1]",
    "(//*[contains(text(),'Tạm tính')]/following::*[contains(normalize-space(),'đ')][1])[1]",
    "(//*[contains(@class,'summary')]//*[contains(normalize-space(),'đ')][1])[1]",
    "(//*[contains(@class,'cart-total')]//*[contains(normalize-space(),'đ')][1])[1]"
  ],
  cartEmptyMessage: [
    "//*[contains(text(),'Giỏ hàng của bạn còn trống')]",
    "//*[contains(text(),'Chưa có sản phẩm trong giỏ')]",
    "//*[contains(text(),'Giỏ hàng trống')]",
    "//*[contains(text(),'Your cart is empty')]"
  ],
  cartEvidenceContainers: [
    "(//tr[contains(@class,'line-item-container')])[1]",
    "(//*[contains(@class,'line-item')])[1]"
  ],
  emptyCartEvidenceContainers: [
    "//*[contains(text(),'Giỏ hàng của bạn còn trống')]/ancestor::div[1]",
    "//*[contains(text(),'Chưa có sản phẩm trong giỏ')]/ancestor::div[1]"
  ]
};

module.exports = { LOCATORS };
