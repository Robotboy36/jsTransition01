

// js中浮点数存储方式
// 64位

//     0:正数，1:负数
// V = Sign 符号位1位   +   (E 阶码 +  bias 2) 11位     +       Fraction 尾数 52位

// 阶码计算： 2 ^ -n 当结果首次小于小数位时，n就是阶码
// E + bias = 2 ^(11 - 1) - 1 - 4 === 1023 - 4 === 1019 === 01111111011

// 尾数计算:
// 小数位保留52位，多余的干掉（舍0进1）

// 浮点计算
// V = (-1)^符号位  (1 + Fraction)  2^阶码
// 由以下五个步骤完成
// 1, 对阶, 原则，小阶对大阶
// 尾数运算、规格化、舍入处理、溢出判断

/**
 * 整数十进制转二进制
 * @param {数值} num 
 */
function toBinary (num) {
    return Number.prototype.toString.call(num, 2)
}


/**
 * 浮点数转二进制
 * @param {浮点数} decimal 
 */
function decimalToBinary (decimal) {
    let binary = '';

    while (binary.length < 64 && isDecimal(decimal)) {
        decimal *= 2
        binary += Math.floor(decimal)

        decimal = (decimal + '').replace(/^\d+\./, '0.') - 0
    }

    return '0.' + binary;
}


/**
 * 十进制转成完整型二进制
 * @param {数值} num 
 */
function toFullBinary (num) {
    const sign = num < 0 ? 1 : 0,
        inter = Math.floor(num);

    // 整数
    if (num === inter) {
        return toBinary(num)
    }

    // 将浮点数 aaa.bbb 拆分成 aaa 与 0.bbb
    let deceil = (num + '').replace(/^\d+\./, '0.') - 0

    // 浮点数
    // 1, 计算阶码
    // 阶码向下取整
    // 0.1 阶码 -4
    // 0.2 阶码 -3
    let decBinary = decimalToBinary(deceil),
        e = -decBinary.match(/\.(0*1)/)[1].length;

    // 2, 计算 e + bias
    // bias 共11位，最大取值是 2^(11 - 1) - 1
    let bias = e + Math.pow(2, 10) - 1;
    let ebias = '0' + toBinary(bias)

    // 3, 计算尾数 Fraction
    // 取整数部分转二进制
    let fraction = decBinary.slice(decBinary.indexOf('.') + 1 - e)

    // 4, 超出52位时，舍0进1
    fraction = roundFraction(fraction)
    
    // 拼接最终完整二进制
    // S + E + bias + Fraction
    let binary = sign + ebias + fill(fraction, 52 - fraction.length, true)
    
    // aaa.bbb
    return toBinary(inter) + '.' + binary
}


/**
 * 整数型二进制转十进制
 * @param {整数型二进制} binary 
 */
function toInter (binary) {
    return Number.parseInt(binary, 2)
}


/**
 * 二进制转十进制
 * @param {二进制字符串} binary 
 */
function toDecimalism (binary) {
    // binary = (binary + '').replace(/\s+/g, '')

    // 非浮点二进制
    if (!isDecimal(binary)) {
        return toInter(binary)
    }

    // 浮点数二进制
    const nums = binary.split('.'),
        intPartNum = toInter(nums[0])

    // 1， 拆分成 S, E + bias, Fraction
    let [, s, ebias, fraction] = nums[1].match(/(\d)(\d{11})(\d{52})/)

    // 2， 计算e
    let e = toInter(ebias) - 1023

    // 3， 还原尾数
    fraction = fill('1', -e - 1) + fraction; // + fraction.slice(12)

    // 将小数位二进制逐个拆开
    // 并将其单独计算出对应的10进制值
    const decimals = fraction.split('').map((value, index) => {
        return Number(value) * Math.pow(2, -(index + 1))
    })

    // 叠加小数部分
    // const decimalSum = decimals.reduce()
    const decimalSum = decimals.reduce((accumulator, cur) => {
        // 考虑到当数值比较小时，js会采用科学计数法
        // 所以限制位数为 15位
        if ((accumulator + '').length > 15) {
            return accumulator;
        }

        return decimalAdd(accumulator, cur)
    })

    return (intPartNum + decimalSum) * Math.pow(-1, s);
}



/**
 * 前面补0
 * @param {原始字符串} str 
 * @param {前面补零个数} fillZeroCount 
 * @param {后面补零} isAppend
 */
function fill (str, fillZeroCount, isAppend = false) {
    let arr = new Array(fillZeroCount).map(item => 1).fill(0, 0, fillZeroCount)

    if (isAppend) {
        return str + arr.join('');
    }

    return arr.join('') + str;
}


/**
 * 格式化成 S E+bias Fraction
 * @param {二进制字符串} binary 
 */
function formatBinary (binary) {
    return binary.replace(/^(\d)(\d{11})/, (_, s, e) => {
        return _.replace(s, s + ' ').replace(e, e + ' ')
    })
}


/**
 * 是否是浮点数
 * @param {数值 或 二进制} num 
 */
function isDecimal (num) {
    return /\./.test(num + '');
}

/**
 * 是否是整数
 * @param {数值} num 
 */
function isInter (num) {
    return num === Math.floor(num);
}

/**
 * 超出52位时进行 舍0进1
 * @param {尾数二进制} binary 
 */
function roundFraction (binary) {
    if (binary.length <= 52) {
        return binary;
    }

    let reference = binary[52] - 0
    if (reference === 0) {
        return binary.slice(0, 52)
    }

    // binary + 1
    binary = binary.slice(0, 52)

    let pre = 1,
        binaryList = binary.split(''),
        i = binaryList.length - 1;
    while (pre === 1 && i >= 0) {
        let sum = binaryList[i] - 0 + pre
        
        binaryList[i] = sum % 2
        pre = sum > 1 ? 1 : 0
        i--;
    }
    
    return binaryList.join('')
}


/**
 * 计算两个浮点数之和
 * @param {操作数a} a 
 * @param {操作数b} b 
 */
function decimalAdd (a, b) {
    if (a === 0 || b === 0) {
        return a + b;
    }

    // 转成字符串
    // 前面拼接0, 便于在操作数叠加到第一位时， per不为0的情况
    let num1 = '0' + a,
        num2 = '0' + b,
        len1 = num1.length,
        len2 = num2.length;

    // 位数均等
    if (num1.length !== num2.length) {
        if (len1 < len2) {
            num1 = fill(num1, len2 - len1, true)
        } else {
            num2 = fill(num2, len1 - len2, true)
        }
    }
    
    // 逐位相加
    let per = 0,
        result = '';
    for (let i = num1.length - 1; i >= 0; i--) {
        if (num1[i] === '.') {
            result += '.';

        } else {
            let sum = (num1[i] - 0) + (num2[i] - 0) + per;

            per = Math.floor(sum / 10);
            result += sum % 10;
        }
    }

    result = result.split('').reverse().join('')
    return Number.parseFloat(result)
}
