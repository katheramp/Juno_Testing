const testData = require('../data/data.json');

function getCaseData(testcase) {
  const data = testData.find(item => item.testcase === testcase);
  if (!data) {
    throw new Error(`Không tìm thấy dữ liệu cho ${testcase}`);
  }
  return data;
}

module.exports = {
  tc24Data: getCaseData('TC24'),
  tc25Data: getCaseData('TC25')
};
