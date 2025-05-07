#!/usr/bin/perl

use strict;
use warnings;


# 最大公約数を求めるサブルーチン ユークリッドの互除法
sub gcd {
    my ($c1, $c2) = @_;
    ($c1, $c2) = (abs $c1, abs $c2);
    # a と b のいずれかが 0 になるまで繰り返す
    while ($c2) {
        my $temp = $c2;
        $c2 = $c1 % $c2; # a を b で割った余りを b に代入
        $c1 = $temp;   # b の値を a に代入
    }
    return $c1; # 最後に残った a が最大公約数
}




# サブルーチン定義: 数値を分数に変換してLaTeX形式にする
# 引数は 分子、分母
sub format_fraction {
    my ($numerator, $denominator) = @_;
    if ($denominator == 0) {return "ERROR : Div Zero";}

    if ($denominator < 0) {
        ($numerator, $denominator) = (-1*$numerator, -1*$denominator);
    }
    
    my @frac = ($numerator/gcd($numerator, $denominator), $denominator/gcd($numerator, $denominator));

    if ($frac[1] == 1) {
        return $frac[0]; # 分母が1なら分子を返す
    } else {
        my $symb="";
        if ($frac[0]<0) {
            $symb="-";
            $frac[0] = abs $frac[0];
        }
        return $symb . "\\frac{" . $frac[0] . "}{" . $frac[1] . "}";  # 分数表示
    }
}


#
# サブルーチン
#
# 数字の生成
#
# 引数
# 1. 生成する数字の個数 1以上の整数
# 2. 数字の大きさ 1以上の整数n を指定すると、 -n ～ n を生成
# 3. 零の有無 フラグ0 を立てると生成する数に0を含まない
#
sub gen_num {
    my ($item, $range, $zero) = @_;

    my @numbers;

    for (1..$item) {
        my $n = int(rand(2*$range + $zero)) - $range;
        if (!($zero)) {
            if ($n>=0) {$n++;}
        }
        push @numbers, $n;
    }

    return @numbers;
}



my ($n1,$n2) = @ARGV;

print "G.C.D. : " . gcd($n1,$n2);

