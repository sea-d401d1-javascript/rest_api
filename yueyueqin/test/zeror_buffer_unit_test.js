const chai = require('chai');
const expect = chai.expect;
const zero_buf = require(__dirname + '/../lib/zero_buffer');

describe('zeor_buf test', () => {
  it('should be reture the buffer with zero', () => {
    var buf = new Buffer([1,2,3,4]);
    expect(buf.reduce( (pre, curr) => pre + curr )).to.eql(10);
    var result = zero_buf(buf);
    expect(result.reduce( (pre,curr) => pre + curr)).to.eql(0);
  });
});
