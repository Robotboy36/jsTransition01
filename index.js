

// js中浮点数存储方式
// 64位

//     0:正数，1:负数
// V = Sign 符号位1位   +   (E 阶码 +  bias 2) 11位     +       Fraction 尾数 52位

// 阶码计算： 2 ^ -n 当结果首次小于小数位时，n就是阶码
// E + bias = 2 ^(11 - 1) - 1 - 4 === 1023 - 4 === 1019 === 01111111011

// 尾数计算:
// 小数位保留52位，多余的干掉

// 浮点计算
// V = (-1)^符号位  (1 + Fraction)  2^阶码
// 由以下五个步骤完成
// 1, 对阶, 原则，小阶对大阶
// 尾数运算、规格化、舍入处理、溢出判断

/**
 * 十进制转二进制
 * @param {数值} num 
 */
function tenToBinary (num) {
    // 阶码向下取整
    // 0.1 阶码 -4, 因为 2^-4 <= 0.1
    // 0.2 阶码 -3
    return Number.prototype.toString.call(num, 2)
}


/**
 * 
 * @param {二进制字符串} binaryString 
 */
function binaryToTen (binaryString) {
    // 整数
    if (!/\./.test(binaryString)) {
        return Number.parseInt(binaryString, 2) + ''
    }

    // 浮点数
    const nums = binaryString.split('.'),
        intPartNum = Number.parseInt(nums[0], 2),
        decimalString = nums[1]

    // 将小数位二进制逐个拆开
    // 并将其单独计算出对应的10进制值
    const decimals = decimalString.split('').map((value, index) => {
        return Number(value) * Math.pow(2, -(index + 1))
    })

    // 叠加小数部分
    const decimalSum = decimals.reduce((accumulator, cur) => accumulator + cur)
    
    return intPartNum + decimalSum + '';
}



/**
 * 两个二进制字符串相加
 * @param {二进制字符串1} binary1 
 * @param {二进制字符串2} binary2 
 */
function binaryAdd (binary1, binary2) {
    // 计算阶码
    // 1, 对阶
}



/**
 * 两个二进制字符串相加
 * @param {二进制字符串1} binary1 
 * @param {二进制字符串2} binary2 
 */
function binaryAdd2 (binary1, binary2) {
    let overs = '',
        len1 = binary1.length,
        len2 = binary2.length;

    if (len1 !== len2) {
        overs = len1 > len2 ?
            binary1.slice(len2) && (binary1 = binary1.slice(0, len2)):
            binary2.slice(len1) && (binary2 = binary2.slice(0, len1));
    }

    let per = 0,
        result = '';
    for (let i = binary1.length - 1; i >= 0; i--) {
        if (binary1[i] === '.') {
            result += '.';

        } else {
            let sum = (binary1[i] - 0) + (binary2[i] - 0) + per,
                remainder = sum <= 1 ? sum : 0;

            per = sum > 1 ? 1 : 0;
            result += remainder;
        }
    }

    return result.split('').reverse().join('')
}

