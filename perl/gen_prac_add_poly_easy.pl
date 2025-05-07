#!/bin/env perl

use strict;
use warnings;

use utf8;
use Encode;

my $print_title = "2次式の加法";
my $num_of_eq = 10; # 問題数
my $num_of_rng = 3; # 数値幅

# レイアウト
my $layout_colmuns = 1; # 段組み数
my $layout_breaks = 10; # 改行問題数



my @ques; # 問題用配列
my @ans; # 解答用配列

# メイン 問題解答生成
for (1..$num_of_eq) {
    my @coeff = (gen_num(2, $num_of_rng, 0), gen_num(4, $num_of_rng, 1)); # 数字生成
    my ($eq,$ans);
    if(int(rand(2))>0){
        # 加法
        $eq = "("
            . trans_poly($coeff[0],$coeff[2],$coeff[4])
            . ")+("
            . trans_poly($coeff[1],$coeff[3],$coeff[5])
            .")";
        $ans = trans_poly($coeff[0]+$coeff[1],$coeff[2]+$coeff[3],$coeff[4]+$coeff[5]);
    } else {
        # 減法
        $eq = "("
            . trans_poly($coeff[0],$coeff[2],$coeff[4])
            . ")-("
            . trans_poly($coeff[1],$coeff[3],$coeff[5])
            .")";
        $ans = trans_poly($coeff[0]-$coeff[1],$coeff[2]-$coeff[3],$coeff[4]-$coeff[5]);
    }



    my $anser = "=" . $ans;

    push @ques, $eq;
    push @ans, $anser;

}



####*####*####*####*####*####*####*####*####*####*

# ヘッダ プリアンブル

my $header =<<'HEADER';
\documentclass[b6paper,10pt]{ltjsarticle}
%\documentclass[landscape,b5paper,10pt]{ltjsarticle}

\usepackage[top=20truemm,bottom=10truemm,left=10truemm,right=10truemm]{geometry}

\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhead[L]{%\fbox{練習問題} \:
HEADER

$header .= $print_title;

$header .=<<'HEADER';
 \ {\tiny \today}}
\fancyhead[R]{\small クラス\hspace{20pt}番号\hspace{20pt}名前\hspace{50pt} \qquad
HEADER

$header .= '/' . $num_of_eq . '}';

$header .=<<'HEADER';
\fancyfoot{}

\renewcommand{\labelenumi}{(\theenumi)}
%\renewcommand{\baselinestretch}{8}

\usepackage{multicol}

\begin{document}
\small
HEADER

#### #### #### ####
# multicols 環境
#### #### #### ####
my $begin_multicols =<<'BEGINMULTICOLS';
%\begin{multicols}{
BEGINMULTICOLS

chomp $begin_multicols;
$begin_multicols .= $layout_colmuns;

$begin_multicols .=<<'BEGINMULTICOLS';
}
\begin{enumerate}
\setlength{\itemsep}{16pt}
BEGINMULTICOLS

my $end_multicols =<<'ENDMULTICOLS';
\end{enumerate}
%\end{multicols}
ENDMULTICOLS


#### #### #### ####
# フッタ出力
my $footer =<<'FOOTER';
\end{document}
FOOTER


####*####*####*####*####*####*####*####*####*####*
####*####*  LaTeX コード出力
####*####*####*####*####*####*####*####*####*####*


print encode('UTF-8', $header);

print $begin_multicols;
#### #### #### ####
# 問題出力
for my $i (0..$#ques){
#    print '\item $', $ques[$i], '$', "\n";
    print '\item $', $ques[$i], '$', "\n\n", '\phantom{$',
         '\displaystyle{} ',
         $ans[$i], '$}', "\n";
    if ($i!= $#ques and $i % $layout_breaks == $layout_breaks-1){
        print '\columnbreak', "\n"
    }
}

print $end_multicols;

print '\newpage', "\n";

print $begin_multicols;
#### #### #### ####
# 解答出力
for my $i (0..$#ques){
    print '\item $', $ques[$i], '$', "\n\n", '$',
#        \displaystyle{} ',
        $ans[$i], '$', "\n";
    if ($i!= $#ques and $i % $layout_breaks == $layout_breaks-1){
        print '\columnbreak', "\n"
    }
}

print $end_multicols;

print $footer;

####*####*####*####*####*####*####*####*####*####*





#### #### #### #### ####
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
    my ($count, $range, $include_zero) = @_;
    my @nums;

    while (@nums < $count) {
        my $num = int(rand(2 * $range + 1)) - $range;

        # 0 を含めるかどうかをチェック
        next if !$include_zero && $num == 0;

        push @nums, $num;
    }

    return @nums;
}

# 互いに素な2数を出力
sub coprime_num {
    my ($item, $range, $zero) = @_;
    my @num = gen_num(2,$range,0);
    return gcd(@num)==1 ? @num : coprime_num($item, $range, $zero);
}


# 係数の変換
# 引数
# 1 数値
# 2 フラグ
## 1 式の頭 +記号はつけない -1は-にする
## 2 式の末尾 +記号はつける -1はそのまま
## 0 式の内部 +記号はつける -1は-にする
sub trans_num {
    my ($n, $flag) = @_;
    my $output;

    if ($flag==1) {
        $output="";
    } else {
        $output="+";
    }

    if ($n>1) {
        $output .= $n;
    } elsif ($n<-1) {
        $output = $n;
    } elsif ($n == -1) {
        if ($flag==2) {$output =$n;}else{$output = "-";}
    } elsif ($n==1) {
        if ($flag==2) {$output .=$n;}
    } elsif ($n==0) {
        $output="";
    }

    return $output;
}



# 分数出力 LaTeX
# LaTeX 分数を出力
# 引数は (分子, 分母)
sub trans_frac {
    my ($numerator,  $denominator) = @_;
    my $output="";

    if ($numerator * $denominator <0) {$output = "-";} # 符号チェック
    ($numerator,  $denominator) = (abs $numerator, abs $denominator); # 正の整数へ変換
    my $g = gcd($numerator,  $denominator); # 最大公約数

    if ($g == $denominator) {
        $output .= $numerator/$g ; # 約分ができる場合
    } else {
        $output .= '\frac{' .  ($numerator / $g)  . '}{' . ($denominator / $g) . '}';
    }

    return $output;
}


# 最大公約数
# 整数を2つ入力し、正の整数が1つ出力される
sub gcd {
    my ($n1, $n2) = map {abs} @_;
    return $n2 == 0 ? $n1 : gcd($n2, $n1 % $n2);
}


# 多項式出力 LaTeX
# 引数に整数を指定し、それを係数とする多項式を出力
sub trans_poly {

    my @coefficients = @_;
    my $degree = $#coefficients;
    my $formula = '';

    for my $i (0 .. $degree) {
        my $coeff = $coefficients[$i];
        my $exp = $degree - $i;

        next if $coeff == 0;

        # 符号の処理
        if ($formula ne '') {
            $formula .= $coeff > 0 ? '+' : '';
        }

        # 係数の絶対値を使用して出力（1は省略）
        if ($exp > 1) {
            $formula .= ($coeff == 1 ? '' : $coeff == -1 ? '-' : $coeff) . "x^{$exp}";
        } elsif ($exp == 1) {
            $formula .= ($coeff == 1 ? '' : $coeff == -1 ? '-' : $coeff) . 'x';
        } else {
            $formula .= $coeff;
        }
    }

    return $formula;

}
