function kmp(source, pattern) {
    // 计算跳转表格
    let table = new Array(pattern.length).fill(0);
    {
        // i: 开始位置 j:记录模式串是否重复
        let i = 1, j = 0;

        while (i < pattern.length) {
            
            if (pattern[i] === pattern[j]) {
                i++, j++;
                table[i] = j;
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }
            }
        }

    }
    console.log(table);


    {
        let i = 0, j = 0;
        while (i < source.length) {
            if (pattern[j] === source[i]) {
                j++, i++;
            }else{
                if (j > 0) {
                    j = table[j];
                }else{
                    i++;
                }
            }
            if (j === pattern.length) {
                return true;
            }
        }
        return false;
    }



}

console.log(kmp("helslo", 'll'));

// a b c d a b c e