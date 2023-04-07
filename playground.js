const data = {
    name: 'naem',
    epitaph: 'epitaph',
    assets: [
    '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
    '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
    ],
    beneficiary: ['beneficiary11', 'beneficiary2'],
    validator: ['validator', 'validator'],
    amount: [
    ['1', '2'],
    ['1', '2'],
    ],
};
const setAllocData = (function constructArray(data) {
  let result = [];
  for (let i = 0; i < data.assets.length; i++) {
    result.push([data.assets[i], data.beneficiary, data.amount[i]]);
  }
  return result;
})(data);


setAllocData.forEach((calldata) => {    console.log(calldata); console.log("split"); })
