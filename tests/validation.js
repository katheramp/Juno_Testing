const { expect } = require('chai');

// Kiểm tra TC24: số lượng đổi đúng và tổng tiền tăng.
function validateTC24({ beforeQuantity, afterQuantity, oldTotal, newTotal, oldSummaryText, newSummaryText }) {
  expect(afterQuantity).to.equal(2, `Số lượng sau cập nhật không đúng. Trước=${beforeQuantity}, Sau=${afterQuantity}`);
  const totalChanged = oldTotal > 0 && newTotal > oldTotal;
  const summaryChanged = oldSummaryText !== newSummaryText;
  expect(
    totalChanged || summaryChanged
  ).to.equal(
    true,
    `Tổng tiền chưa tăng hoặc phần tóm tắt chưa đổi. Trước=${oldTotal} (${oldSummaryText}), Sau=${newTotal} (${newSummaryText})`
  );
}

// Kiểm tra TC25: sản phẩm bị xóa hoặc hiển thị giỏ hàng trống.
function validateTC25({ itemCountAfterUpdate, quantityInputsAfterUpdate, emptyMessage }) {
  const isRemoved = itemCountAfterUpdate === 0 && quantityInputsAfterUpdate === 0;
  const hasEmptyMessage = Boolean(emptyMessage);
  expect(isRemoved || hasEmptyMessage).to.equal(
    true,
    `Giỏ hàng chưa trống sau khi cập nhật về 0. itemCount=${itemCountAfterUpdate}, quantityInputs=${quantityInputsAfterUpdate}, emptyMessage=${emptyMessage || '<empty>'}`
  );
}

module.exports = {
  validateTC24,
  validateTC25
};
