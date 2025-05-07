#!/bin/env perl

use strict;
use warnings;

use utf8;
use Encode;


my @ques; # 問題用配列
my @ans; # 解答用配列

# メイン生成
for (1..30) {
    my @number = (gen_num(2, 5, 0), gen_num(1,5,1));


    my $poly =
        trans_num($number[0], 1)
        . "x^{2}"
        . trans_num($number[1], 0)
        . "x"
        . trans_num($number[2], 2);


    my $p = "+" . trans_frac($number[1], 2*$number[0]);
    $p =~ s/\+-/-/;

    my $q;
    my $discriminant = -1*$number[1]**2 + 4*$number[0]*$number[2];
    if ($discriminant) {
        $q = "+" . trans_frac($discriminant, 4*$number[0]);
    } else {
        $q="";
    }
    $q =~ s/\+-/-/;

    my $anser = trans_num($number[0],1) . '\left(x' . $p . '\right)^{2}' . $q;


#    $poly =~ s/1x/x/g;
#    $poly =~ s/\+-/-/g;

    push @ques, $poly;
    push @ans, $anser;

}



#for (0..4){
#    print $ques[$_], " :: ", $ans[$_], "\n";
#}



####*####*####*####*####*####*####*####*####*####*

# ヘッダ プリアンブル
my $header =<<'HEADER';
\documentclass[landscape,b5paper,10pt]{ltjsarticle}

\usepackage[top=20truemm,bottom=10truemm,left=10truemm,right=10truemm]{geometry}

\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhead[L]{練習問題:平方完成 \qquad 生成日:\today}
\fancyhead[R]{クラス\hspace{50pt}番号\hspace{50pt}名前\hspace{200pt} \qquad /30}
\fancyfoot{}

\renewcommand{\labelenumi}{(\theenumi)}
%\renewcommand{\baselinestretch}{8}

\usepackage{multicol}

\begin{document}
\small
HEADER

# multicols 環境
my $begin_multicols =<<'BEGINMULTICOLS';
\begin{multicols}{5}
\begin{enumerate}
\setlength{\itemsep}{40pt}
BEGINMULTICOLS

my $end_multicols =<<'ENDMULTICOLS';
\end{enumerate}
\end{multicols}
ENDMULTICOLS

# フッタ出力
my $footer =<<'FOOTER';
\end{document}
FOOTER


####*####*####*####*####*####*####*####*####*####*
####*####*  LaTeX コード出力
####*####*####*####*####*####*####*####*####*####*


print encode('UTF-8', $header);

print $begin_multicols;

# 問題出力
for my $i (0..$#ques){
#    print '\item $', $ques[$i], '$', "\n";
    print '\item $', $ques[$i], '$', "\n\n", '\phantom{$\displaystyle = ', $ans[$i], '$}', "\n";
    if ($i!= $#ques and $i % 6 == 5){print '\columnbreak', "\n"}
}

print $end_multicols;

print '\newpage', "\n";

print $begin_multicols;

# 解答出力
for my $i (0..$#ques){
    print '\item $', $ques[$i], '$', "\n\n", '$\displaystyle = ', $ans[$i], '$', "\n";
    if ($i!= $#ques and $i % 6 == 5){print '\columnbreak', "\n"}
}

print $end_multicols;

print $footer;

####*####*####*####*####*####*####*####*####*####*





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



# 分数出力
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
  my ($x, $y) = @_;
  ($x, $y) = (abs($x), abs($y));
  while ($x>0 && $y>0) {
    if ($y > $x) {
      $y %= $x;
    } else {
      $x %= $y;
    }
  }
  return $x if $x>0;
  return $y if $y>0;
}


