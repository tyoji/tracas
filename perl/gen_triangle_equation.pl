#!/usr/bin/perl

use strict;
use warnings;
use List::Util 'shuffle';


# 三角比の値
my @vl=(
    "0",
    "\\frac{1}{2}",
    "\\frac{1}{\\sqrt{2}}",
    "\\frac{\\sqrt{3}}{2}",
    "1",
    "\\frac{1}{\\sqrt{3}}",
    "\\sqrt{3}"
    );

# 角度とその三角比の値のハッシュリスト
my @angles = (
    {"ques" => "\\sin{0^\\circ}", "ans" => $vl[0]},
    {"ques" => "\\sin{30^\\circ}", "ans" => $vl[1]},
    {"ques" => "\\sin{45^\\circ}", "ans" => $vl[2]},
    {"ques" => "\\sin{60^\\circ}", "ans" => $vl[3]},
    {"ques" => "\\sin{90^\\circ}", "ans" => $vl[4]},
    {"ques" => "\\sin{120^\\circ}", "ans" => $vl[3]},
    {"ques" => "\\sin{135^\\circ}", "ans" => $vl[2]},
    {"ques" => "\\sin{150^\\circ}", "ans" => $vl[1]},
    {"ques" => "\\sin{180^\\circ}", "ans" => $vl[0]},
    {"ques" => "\\cos{0^\\circ}", "ans" => $vl[4]},
    {"ques" => "\\cos{30^\\circ}", "ans" => $vl[3]},
    {"ques" => "\\cos{45^\\circ}", "ans" => $vl[2]},
    {"ques" => "\\cos{60^\\circ}", "ans" => $vl[1]},
    {"ques" => "\\cos{90^\\circ}", "ans" => $vl[0]},
    {"ques" => "\\cos{120^\\circ}", "ans" => "-".$vl[1]},
    {"ques" => "\\cos{135^\\circ}", "ans" => "-".$vl[2]},
    {"ques" => "\\cos{150^\\circ}", "ans" => "-".$vl[3]},
    {"ques" => "\\cos{180^\\circ}", "ans" => "-".$vl[4]},
    {"ques" => "\\tan{0^\\circ}", "ans" => $vl[0]},
    {"ques" => "\\tan{30^\\circ}", "ans" => $vl[5]},
    {"ques" => "\\tan{45^\\circ}", "ans" => $vl[4]},
    {"ques" => "\\tan{60^\\circ}", "ans" => $vl[6]},
    {"ques" => "\\tan{90^\\circ}", "ans" => "なし"},
    {"ques" => "\\tan{120^\\circ}", "ans" => "-".$vl[6]},
    {"ques" => "\\tan{135^\\circ}", "ans" => "-".$vl[4]},
    {"ques" => "\\tan{150^\\circ}", "ans" => "-".$vl[5]},
    {"ques" => "\\tan{180^\\circ}", "ans" => $vl[0]},
);

# 角度をランダムにシャッフル
my @shuffled_angles = shuffle(@angles);

my $qst="\\begin{multicols}{5}\\begin{enumerate}";
my $ans="\\begin{multicols}{5}\\begin{enumerate}";
foreach my $angle (@shuffled_angles[0..26]) {
    $qst .= "\\item \$ $angle->{ques} \$\n";
    $ans .= "\\item \$ $angle->{ques} = $angle->{ans}\$\n";
}
$qst .= "\\end{enumerate}\\end{multicols}";
$ans .= "\\end{enumerate}\\end{multicols}";


print <<"END";
\\documentclass[landscape,b5paper,10pt]{ltjsarticle}

\\usepackage[top=20truemm,bottom=10truemm,left=10truemm,right=10truemm]{geometry}

\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhead[L]{練習問題:三角比 \\qquad 生成日:\\today}
\\fancyhead[R]{クラス\\hspace{50pt}番号\\hspace{50pt}名前\\hspace{200pt} \\qquad /27}
\\fancyfoot{}

\\renewcommand{\\labelenumi}{(\\theenumi)}
\\renewcommand{\\baselinestretch}{4}

\\usepackage{multicol}

\\usepackage{amsmath}

\\begin{document}
%次の三角比の値を求めなさい
END

# 問題を出力
print $qst;

print "\n\n\\newpage\n\n";

print $qst;

print "\n\n\\newpage\n\n";

# 解答を出力
print $ans;

print "\n\n\\newpage\n\n";

print $ans;

print <<"END";
\\end{document}
END

