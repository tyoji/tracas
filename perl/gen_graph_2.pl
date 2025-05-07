#!/bin/env perl

use strict;
use warnings;

use utf8;



# ヘッダ出力

my $header =<<'HEADER';
\documentclass[landscape,a3paper,12pt]{ltjsarticle}

\usepackage[top=20truemm,bottom=50truemm,left=10truemm,right=10truemm]{geometry}

\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhead[L]{練習問題:2次関数のグラフ \hspace{50pt} 生成日:\today}
\fancyhead[R]{クラス\hspace{50pt}名前\hspace{150pt} /20}
\fancyfoot{}

\renewcommand{\labelenumi}{(\theenumi)}
\renewcommand{\baselinestretch}{8}

\usepackage{multicol}

\begin{document}
\begin{multicols}{4}
\begin{enumerate}
HEADER

print $header;


for (1..20) {
# メイン生成

my @number_list = ( @{gen_num(1, 7, 0)}, @{gen_num(2, 7, 1)} );
my $output_q
    = '\item $y='
    . trance_num(1,$number_list[0])
    . '(x'
    . trance_num(0,$number_list[1])
    . ')^{2}'
    . trance_num(2,$number_list[2])
    . '$';
$output_q =~ s/\(x\)\^/x\^/;

print $output_q;
print "\n";

}


# フッタ出力
my $footer =<<'FOOTER';
\end{enumerate}
\end{multicols}
\end{document}
FOOTER

print $footer;





#
# サブルーチン
# 数字の生成
#
# 引数
# 1. 生成する数字の個数 1以上の整数
# 2. 数字の大きさ 1以上の整数n を指定すると、 -n ～ n を生成
# 3. 零の有無 フラグ0 を立てると生成する数に0を含まない
#
sub gen_num {
    my $item = shift;
    my $range = shift;
    my $zero = shift;

    my $numbers = [];

    for (1..$item) {
        my $n = int(rand(2*$range + $zero)) - $range;
        if (!($zero)) {
            if ($n>=0) {$n++;}
        }
        push @{$numbers}, $n;
    }

    return $numbers;
}

# 引数
# 1
## 1 式の頭 +記号はつけない -1は-にする
## 2 式の末尾 +記号はつける -1はそのまま
# 2　数値
sub trance_num {
    my $plus = shift;
    my $n = shift;
    my $output;

    if (!($plus==1)) {$output="+";}

    if ($n>1) {
        $output .= $n;
    } elsif ($n<-1) {
        $output = $n;
    } elsif ($n=-1) {
        $output = "-";
        if ($plus==2) {$output.="1";};
    } elsif ($n==0) {$output="";}
}



