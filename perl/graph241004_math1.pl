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


# サブルーチン定義: 頂点の座標を計算
# 出力は「x座標の分子、分母、y座標の分子、分母」
sub calculate_vertex {
    my ($c1, $c2, $c3) = @_;
    if($c1 == 0) {return "ERROR : No Quadratic Functions";}
    my @x = (-$c2, 2*$c1);
    my @y = (-$c2**2+4*$c1*$c3, 4*$c1);
    return ($x[0]/gcd(@x), $x[1]/gcd(@x), $y[0]/gcd(@y), $y[1]/gcd(@y));
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



# サブルーチン定義: LaTeX Tikzコードを生成
sub generate_latex_code {
    my ($c1, $c2, $c3) = @_;

    my ($x_value, $y_value) = ("below", "left"); # 軸上の値の位置

    # 頂点の座標を取得
    my ($x_nume, $x_deno, $y_nume, $y_deno) = calculate_vertex($c1, $c2, $c3);
    my ($x_vertex, $y_vertex) = ($x_nume / $x_deno, $y_nume / $y_deno);

    my ($x_min, $x_max, $y_min, $y_max); # グラフを描く範囲
    if ($x_vertex >0) {
        ($x_min, $x_max) = (-1, 2* $x_vertex);  # x軸
    } elsif ($x_vertex <0) {
        ($x_min, $x_max) = (2* $x_vertex, 1);  # x軸
        $y_value = "right"; # y軸上の値の位置
    } else {
        ($x_min, $x_max) = (-3, 3);  # x軸
    }

    if( $c1>0 ){
        if ($y_vertex >0) {
            ($y_min, $y_max) = (-1, 2*$y_vertex);  # y軸
        } elsif ($y_vertex <0) {
            ($y_min, $y_max) = ($y_vertex-1, 1);  # y軸
            $x_value = "above"; # x軸上の値の位置
        } else {
            ($x_min, $x_max) = (-1, 3);  # x軸
        }
    } else {
        if ($y_vertex >0) {
            ($y_min, $y_max) = (-1, $y_vertex+1);  # y軸
        } elsif ($y_vertex <0) {
            ($y_min, $y_max) = (2*$y_vertex, 1);  # y軸
            $x_value = "above"; # x軸上の値の位置
        } else {
            ($y_min, $y_max) = (-3, 1);  # y軸
        }
    }

    my ($range) = sort {$b <=> $a} ($x_max-$x_min, $y_max-$y_min);
    ($x_min, $x_max) = ($x_vertex-$range/2, $x_vertex+$range/2);
    ($y_min, $y_max) = ($y_vertex+$c1/2-$range/2, $y_vertex+$c1/2+$range/2);

    if ($x_min>-1) {$x_min=-1}
    if ($x_max<1) {$x_max=1}
    if ($y_min>-1) {$y_min=-1}
    if ($y_max<1) {$y_max=1}

    ($range) = sort {$b <=> $a} ($x_max-$x_min, $y_max-$y_min);

#    my $scale = 2/$range;
    my $scale = 0.4;

    # 頂点の座標を分数表記にフォーマット
    my $x_vertex_frac = format_fraction($x_nume, $x_deno);
    my $y_vertex_frac = format_fraction($y_nume, $y_deno);


    my ($x_coordinate, $y_coordinate, $x_coor_value, $y_coor_value)
        = ($x_vertex, $y_vertex, $x_vertex_frac, $y_vertex_frac);

    if ($x_vertex==0) {
        ($x_coordinate, $y_coordinate, $x_coor_value, $y_coor_value)
            =(1, $c1+$c2+$c3, 1, $c1+$c2+$c3);
    }


    return <<"END_LATEX";
\\begin{tikzpicture}[scale=$scale]  % スケールを設定
    % x軸とy軸の描画
    \\draw[->] ($x_min,0) -- ($x_max,0) node[below] {\$x\$};  % x軸
    \\draw[->] (0,$y_min) -- (0,$y_max) node[left] {\$y\$};  % y軸
%    \\draw (0,0) node[below left]{O}; %原点

    % clipオプションを有効にし、二次関数のグラフを描画
    \\clip ($x_min, $y_min) rectangle ($x_max, $y_max);  % 描画範囲のクリッピング
    \\draw[smooth, samples=100] plot (\\x, {$c1*pow(\\x,2) + $c2*\\x + $c3}) node[right] {};


    % 点とx軸、y軸を結ぶ点線
    % x軸上にx座標を表示
    \\draw[dashed] ($x_coordinate, 0) -- ($x_coordinate, $y_coordinate);
    \\node[$x_value] at ($x_coordinate, 0) {\\small \$ $x_coor_value \$};

    % y軸上にy座標を表示
    \\draw[dashed] (0, $y_coordinate) -- ($x_coordinate, $y_coordinate);
    \\node[$y_value] at (0, $y_coordinate) {\\small \$ $y_coor_value \$};

    % 定数項の点をプロット
    \\fill (0, $c3) node[$y_value] {\$ $c3 \$};
\\end{tikzpicture}
END_LATEX
}

sub quadratic_func {
    my ($num1, $num2, $num3) = @_;

    my ($x_nume, $x_deno, $y_nume, $y_deno) = calculate_vertex($num1, $num2, $num3);

    print "頂点 \\; \$ \\left("
        . format_fraction($x_nume, $x_deno)
        . ",\\;"
        . format_fraction($y_nume, $y_deno)
        . "\\right)\$\n";
    print "\\quad 軸 \$x=" . format_fraction($x_nume, $x_deno) . "\$\n\n";
    print generate_latex_code($num1, $num2, $num3);
}




## メイン部分: 標準入力からa, b, cの値を取得
#print "Enter coefficient a: ";
#my $c1 = <STDIN>;
#chomp($c1);

#print "Enter coefficient b: ";
#my $c2 = <STDIN>;
#chomp($c2);

#print "Enter coefficient c: ";
#my $c3 = <STDIN>;
#chomp($c3);

# サブルーチンを呼び出して、LaTeXコードを生成
#my $latex_code = generate_latex_code($c1, $c2, $c3);

# LaTeXコードを表示
#print "\nGenerated LaTeX code:\n\n";
#print $latex_code;


my ($c1, $c2, $c3) = @ARGV;

quadratic_func ($c1, $c2, $c3);

