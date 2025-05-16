
/** テキストコピー */
function copy_text(id) {
  const ele = document.getElementById(id);
  navigator.clipboard.writeText(ele.textContent);
}

// 非表示切り替え
function hidden_area(hidden_block) {
  if (hidden_block.style.display == "none") {
    hidden_block.style.display = "block";
  } else {
    hidden_block.style.display = "none";
  };
}

// 枠内印刷
function printout_area(print_area) {
  const original_html = document.body.innerHTML;
  const print_data = document.getElementById(print_area).innerHTML;

  document.body.innerHTML = print_data;
  MathJax.typeset();
  window.print();
  document.body.innerHTML = original_html;
}

// 表示幅切替
function change_width() {
  const select_option = document.getElementById("mathjax_layout").value;
  let width_value;
  switch (select_option) {
    case "non":
      width_value = "0em";
      break;
    case "narrow":
      width_value = "3em";
      break;
    case "standard":
      width_value = "6em";
      break;
    case "wide":
      width_value = "15em";
      break;
    default:
      width_value = "4em";
      break;
  };
  document.querySelectorAll("ol#question li").forEach(item => {
    item.style.paddingLeft = "1em";
    item.style.paddingBottom = width_value;
  });
}


/** 問題生成 */
function generated_problems() {
  const num_ques = document.getElementById("number_questions").value;
  const sel_prob = document.getElementById("select_problems").value;

  // 出力先エリア
  const output_area = document.getElementById("latex_source_code");
  output_area.textContent = "";
  const output_area_overleaf = document.getElementById("overleaf_snip");
  output_area_overleaf.textContent = "";
  const output_print_out_area = document.getElementById("print_out_area");
  output_print_out_area.textContent = "";


  const questions = []; // 問題格納用配列
  const answers = []; // 解答格納用配列

  for (let i = 0; i < num_ques; i++) {
    const [ques, ans] = select_generation_function(sel_prob);
    questions.push(ques);
    answers.push(ans);
  }

  // 表示、コピー用 エリアに出力
  output_area.textContent = layout_latexdoc(questions, answers);
  // Overleaf用 textareaへ出力
  output_area_overleaf.textContent = layout_latexdoc(questions, answers);
  // MathJax用 div へ出力
  output_print_out_area.innerHTML = layout_mathjax_latexdoc(questions, answers);
  MathJax.typeset()

}


/** 問題生成切替用関数 */
function select_generation_function(select_option) {
  const int_val = document.getElementById("integer_value").value;
  let ques, ans;

  switch (select_option) {
    case "add_int":
      [ques, ans] = addition_integers(int_val);
      ans = "=" + ans;
      break;
    case "multi_int":
      [ques, ans] = multiplication_integers(int_val);
      ans = "=" + ans;
      break;
    case "add_ratio":
      [ques, ans] = addition_rational_nums(int_val);
      ques = "\\displaystyle{}" + ques;
      ans = "\\displaystyle{} =" + ans;
      break;
    case "multi_ratio":
      [ques, ans] = multiplication_rational_nums(int_val);
      ques = "\\displaystyle{}" + ques;
      ans = "\\displaystyle{} =" + ans;
      break;
    case "multi_cplx":
      [ques, ans] = multiplication_complex_nums(int_val);
      ans = "=" + ans;
      break;
    case "add_poly":
      [ques, ans] = addition_polynomials(int_val);
      ans = "=" + ans;
      break;
    case "multi_monic_poly":
      [ques, ans] = multiplication_monic_polynomials(int_val);
      ans = "=" + ans;
      break;
    case "multi_poly":
      [ques, ans] = multiplication_polynomials(int_val);
      ans = "=" + ans;
      break;
    case "factorization_monic_poly":
      [ans, ques] = multiplication_monic_polynomials(int_val);
      ans = "=" + ans;
      break;
    case "factorization_poly":
      [ans, ques] = multiplication_polynomials(int_val);
      ans = "=" + ans;
      break;
    case "equation_ratio":
      [ques, ans] = equation_rational_numbers(int_val);
      ans = "\\displaystyle{} x=" + ans;
      break;
    case "equation_cplx":
      [ques, ans] = equation_complex_numbers(int_val);
      ans = "\\displaystyle{} x=" + ans;
      break;
    case "comp_sq_int":
      [ques, ans] = completing_the_square_int(int_val);
      ans = "=" + ans;
      break;
    case "comp_sq":
      [ques, ans] = completing_the_square(int_val);
      ans = "\\displaystyle{} =" + ans;
      break;
    case "tri_ratio_val":
      [ques, ans] = triangle_function_value(1);
      if (ans !== "値なし") { ans = "\\displaystyle{} =" + ans; }
      break;
    case "tri_func_val":
      [ques, ans] = triangle_function_value(2);
      if (ans !== "値なし") { ans = "\\displaystyle{} =" + ans; }
      break;
    default:
      [ques, ans] = ["問題種別を選択してください", "問題種別を選択してください"];
      break;
  }

  return [ques, ans];
}


/** 問題生成用関数 */

// 問題作成 整数の加法
function addition_integers(range) {
  const integers = generate_integers(2, range, false);
  let ques = integers[0];
  let ans;

  if (Math.floor(Math.random() * 2) === 0) {
    ques += "+";
    ans = integers[0] + integers[1];
  } else {
    ques += "-";
    ans = integers[0] - integers[1];
  }
  if (integers[1] < 0) {
    ques += "(" + integers[1] + ")";
  } else {
    ques += integers[1];
  }
  return [ques, ans];
}

// 問題作成 整数の乗法
function multiplication_integers(range) {
  const integers = generate_integers(2, range, false);
  let ques = integers[0] + " \\times ";
  let ans;

  if (integers[1] < 0) {
    ques += "(" + integers[1] + ")";
  } else {
    ques += "" + integers[1] + "";
  }
  ans = integers[0] * integers[1];

  return [ques, ans];
}


// 問題作成 有理数の加法
function addition_rational_nums(range) {
  const integers = generate_integers(4, range, false);
  let ques = transport_fraction_latex(integers[0], integers[1]);
  let ans;

  if (Math.floor(Math.random() * 2) === 0) {
    ques += "+";
    ans = transport_fraction_latex(integers[0] * integers[3] + integers[1] * integers[2], integers[1] * integers[3]);
  } else {
    ques += "-";
    ans = transport_fraction_latex(integers[0] * integers[3] - integers[1] * integers[2], integers[1] * integers[3]);
  }

  if (integers[2] * integers[3] < 0) {
    ques += "\\left(" + transport_fraction_latex(integers[2], integers[3]) + "\\right)";
  } else {
    ques += transport_fraction_latex(integers[2], integers[3]);
  }
  return [ques, ans];
}


// 問題作成 有理数の乗法
function multiplication_rational_nums(range) {
  const integers = generate_integers(4, range, false);
  let ques = transport_fraction_latex(integers[0], integers[1]);
  let ans;

  if (Math.floor(Math.random() * 2) === 0) {
    ques += "\\times{}";
    ans = transport_fraction_latex(integers[0] * integers[2], integers[1] * integers[3]);
  } else {
    ques += "\\div{}";
    ans = transport_fraction_latex(integers[0] * integers[3], integers[1] * integers[2]);
  }

  if (integers[2] * integers[3] < 0) {
    ques += "\\left(" + transport_fraction_latex(integers[2], integers[3]) + "\\right)";
  } else {
    ques += transport_fraction_latex(integers[2], integers[3]);
  }
  return [ques, ans];
}

// 問題作成 複素数の乗法
function multiplication_complex_nums(range) {
  const integers = generate_integers(4, range, false);
  let ques, ans;
  const re1 = integers[0];
  const re2 = integers[1];
  const im1 = integers[2];
  const im2 = integers[3];

  let complex_1 = re1;
  if (im1 > 0) { complex_1 += "+"; }
  complex_1 += transport_monomial(im1, "i");
  let complex_2 = re2;
  if (im2 > 0) { complex_2 += "+"; }
  complex_2 += transport_monomial(im2, "i");

  if (complex_1 === complex_2) {
    ques = "(" + complex_1 + ")^{2}";
  } else {
    ques = "(" + complex_1 + ")(" + complex_2 + ")";
  }

  const re3 = re1 * re2 - im1 * im2;
  const im3 = re1 * im2 + re2 * im1;
  ans = re3 === 0 ? ans = "" : ans = re3;
  if (im3 !== 0) {
    if (re3 !== 0 && im3 > 0) { ans += "+"; }
    ans += transport_monomial(im3, "i");
  }

  return [ques, ans];
}

// 問題作成 多項式の加法
function addition_polynomials(range) {
  const integers = [...generate_integers(2, range, false), ...generate_integers(4, range)];
  let ques, ans;
  const polynomial_1 = transport_polynomial_latex(integers[0], integers[2], integers[4]);
  const polynomial_2 = transport_polynomial_latex(integers[1], integers[3], integers[5]);

  if (Math.floor(Math.random() * 2) === 0) {
    ques = "(" + polynomial_1 + ")+(" + polynomial_2 + ")";
    ans = transport_polynomial_latex(integers[0] + integers[1], integers[2] + integers[3], integers[4] + integers[5]);
  } else {
    ques = "(" + polynomial_1 + ")-(" + polynomial_2 + ")";
    ans = transport_polynomial_latex(integers[0] - integers[1], integers[2] - integers[3], integers[4] - integers[5]);
  }
  return [ques, ans];
}

// 問題作成 モニック多項式の乗法
function multiplication_monic_polynomials(range) {
  const integers = generate_integers(2, range, false);
  let ques, ans;

  let coeff_1 = integers[0];
  let coeff_2 = integers[1];

  const polynomial_1 = transport_polynomial_latex(1, coeff_1);
  const polynomial_2 = transport_polynomial_latex(1, coeff_2);

  if (polynomial_1 === polynomial_2) {
    ques = "(" + polynomial_1 + ")^{2}";
  } else {
    ques = "(" + polynomial_1 + ")(" + polynomial_2 + ")";
  }
  ans = transport_polynomial_latex(1, coeff_1 + coeff_2, coeff_1 * coeff_2);

  return [ques, ans];
}

// 問題作成 多項式の乗法
function multiplication_polynomials(range) {
  const integers = generate_integers(4, range, false);
  let ques, ans;
  let coeff_p1_1, coeff_p1_2, coeff_p2_1, coeff_p2_2;
  coeff_p1_1 = integers[0] / gcd(integers[0], integers[2]);
  coeff_p1_2 = integers[2] / gcd(integers[0], integers[2]);
  coeff_p2_1 = integers[1] / gcd(integers[1], integers[3]);
  coeff_p2_2 = integers[3] / gcd(integers[1], integers[3]);

  if (coeff_p1_1 < 0) {
    coeff_p1_1 = -1 * coeff_p1_1;
    coeff_p1_2 = -1 * coeff_p1_2;
  }
  if (coeff_p2_1 < 0) {
    coeff_p2_1 = -1 * coeff_p2_1;
    coeff_p2_2 = -1 * coeff_p2_2;
  }

  const polynomial_1 = transport_polynomial_latex(coeff_p1_1, coeff_p1_2);
  const polynomial_2 = transport_polynomial_latex(coeff_p2_1, coeff_p2_2);

  if (polynomial_1 === polynomial_2) {
    ques = "(" + polynomial_1 + ")^{2}";
  } else {
    ques = "(" + polynomial_1 + ")(" + polynomial_2 + ")";
  }
  ans = transport_polynomial_latex(coeff_p1_1 * coeff_p2_1, coeff_p1_1 * coeff_p2_2 + coeff_p1_2 * coeff_p2_1, coeff_p1_2 * coeff_p2_2);

  return [ques, ans];
}

// 問題作成 方程式 有理数
function equation_rational_numbers(range) {
  const integers = generate_integers(4, range, false);
  let ques, ans;
  let coeff_p1_1, coeff_p1_2, coeff_p2_1, coeff_p2_2;
  coeff_p1_1 = integers[0] / gcd(integers[0], integers[2]);
  coeff_p1_2 = integers[2] / gcd(integers[0], integers[2]);
  coeff_p2_1 = integers[1] / gcd(integers[1], integers[3]);
  coeff_p2_2 = integers[3] / gcd(integers[1], integers[3]);

  if (coeff_p1_1 < 0) {
    coeff_p1_1 = -1 * coeff_p1_1;
    coeff_p1_2 = -1 * coeff_p1_2;
  }
  if (coeff_p2_1 < 0) {
    coeff_p2_1 = -1 * coeff_p2_1;
    coeff_p2_2 = -1 * coeff_p2_2;
  }

  ques = transport_polynomial_latex(coeff_p1_1 * coeff_p2_1, coeff_p1_1 * coeff_p2_2 + coeff_p1_2 * coeff_p2_1, coeff_p1_2 * coeff_p2_2) + "=0";
  if (coeff_p1_1 === coeff_p2_1 && coeff_p1_2 === coeff_p2_2) {
    ans = transport_fraction_latex(-1 * coeff_p1_2, coeff_p1_1);
  } else {
    ans = transport_fraction_latex(-1 * coeff_p1_2, coeff_p1_1) + " , " + transport_fraction_latex(-1 * coeff_p2_2, coeff_p2_1);
  }
  return [ques, ans];
}

// 問題作成 方程式 複素数
function equation_complex_numbers(range) {
  const integers = generate_integers(3, range, false);
  let ques, ans;
  let coeff_a, coeff_b, coeff_c;
  coeff_a = integers[0] / gcd(integers[0], integers[1], integers[2]);
  coeff_b = integers[1] / gcd(integers[0], integers[1], integers[2]);
  coeff_c = integers[2] / gcd(integers[0], integers[1], integers[2]);
  const discriminant = coeff_b ** 2 - 4 * coeff_a * coeff_c;

  ques = transport_polynomial_latex(coeff_a, coeff_b, coeff_c) + "=0";

  if (coeff_a < 0) {
    coeff_a *= -1; coeff_b *= -1; coeff_c *= -1;;
  }

  if (discriminant === 0) { //重解の場合
    ans = transport_fraction_latex(-1 * coeff_b, 2 * coeff_a);
  } else {
    let out_sq, in_sq;
    [out_sq, in_sq] = simplify_sqrt_root(Math.abs(discriminant));

    const common_div = gcd(coeff_b, 2 * coeff_a, out_sq);
    const denominator = 2 * coeff_a / common_div;
    const numerator1 = -1 * coeff_b / common_div;
    const numerator2 = out_sq / common_div;

    if (in_sq === 1) { // 有理数解の場合
      ans = transport_fraction_latex(numerator1 + numerator2, denominator) + ", " + transport_fraction_latex(numerator1 - numerator2, denominator);
    } else {
      let numerator = numerator1 + "\\pm " + transport_monomial(numerator2, "\\sqrt{") + in_sq + "}";
      if (discriminant < 0) { numerator += "i"; }

      if (denominator === 1) {
        ans = numerator;
      } else {
        ans = "\\frac{" + numerator + "}{" + denominator + "}"
      }
    }
  }

  return [ques, ans];
}

// 問題作成 平方完成 整数
function completing_the_square_int(range) {
  const integers = generate_integers(2, range, false);
  let ques = transport_polynomial_latex(1, 2 * integers[0], (integers[0] ** 2) + integers[1]);
  let ans = "(" + transport_polynomial_latex(1, integers[0]) + ")^{2}";
  if (integers[1] > 0) { ans += "+"; }
  ans += integers[1];

  return [ques, ans];
}

// 問題作成 平方完成
function completing_the_square(range) {
  const integers = generate_integers(3, range, false);
  const ques = transport_polynomial_latex(integers[0], integers[1], integers[2]);
  let ans = transport_monomial(integers[0], "\\left( x");

  if (integers[1] / integers[0] > 0) { ans += "+"; }
  ans += transport_fraction_latex(integers[1], 2 * integers[0]) + "\\right)^{2}";
  let nu = 4 * integers[0] * integers[2] - (integers[1] ** 2);
  let de = 4 * integers[0];
  if (nu / de > 0) { ans += "+"; }
  ans += transport_fraction_latex(nu, de);

  return [ques, ans];
}

// 問題作成 三角関数の値
function triangle_function_value(flag_value) {
  const trifunc_values = [
    ["\\sin{0^\\circ}", "0"],
    ["\\cos{0^\\circ}", "1"],
    ["\\tan{0^\\circ}", "0"],
    ["\\sin{30^\\circ}", "\\frac{1}{2}"],
    ["\\cos{30^\\circ}", "\\frac{\\sqrt{3}}{2}"],
    ["\\tan{30^\\circ}", "\\frac{1}{\\sqrt{3}}"],
    ["\\sin{45^\\circ}", "\\frac{1}{\\sqrt{2}}"],
    ["\\cos{45^\\circ}", "\\frac{1}{\\sqrt{2}}"],
    ["\\tan{45^\\circ}", "1"],
    ["\\sin{60^\\circ}", "\\frac{\\sqrt{3}}{2}"],
    ["\\cos{60^\\circ}", "\\frac{1}{2}"],
    ["\\tan{60^\\circ}", "\\sqrt{3}"],
    ["\\sin{90^\\circ}", "1"],
    ["\\cos{90^\\circ}", "0"],
    ["\\tan{90^\\circ}", "\\text{値なし}"],
    ["\\sin{120^\\circ}", "\\frac{\\sqrt{3}}{2}"],
    ["\\cos{120^\\circ}", "-\\frac{1}{2}"],
    ["\\tan{120^\\circ}", "-\\sqrt{3}"],
    ["\\sin{135^\\circ}", "\\frac{1}{\\sqrt{2}}"],
    ["\\cos{135^\\circ}", "-\\frac{1}{\\sqrt{2}}"],
    ["\\tan{135^\\circ}", "-1"],
    ["\\sin{150^\\circ}", "\\frac{1}{2}"],
    ["\\cos{150^\\circ}", "-\\frac{\\sqrt{3}}{2}"],
    ["\\tan{150^\\circ}", "-\\frac{1}{\\sqrt{3}}"],
    ["\\sin{180^\\circ}", "0"],
    ["\\cos{180^\\circ}", "-1"],
    ["\\tan{180^\\circ}", "0"], // 27
    ["\\sin{210^\\circ}", "-\\frac{1}{2}"],
    ["\\cos{210^\\circ}", "-\\frac{\\sqrt{3}}{2}"],
    ["\\tan{210^\\circ}", "\\frac{1}{\\sqrt{3}}"],
    ["\\sin{225^\\circ}", "-\\frac{1}{\\sqrt{2}}"],
    ["\\cos{225^\\circ}", "-\\frac{1}{\\sqrt{2}}"],
    ["\\tan{225^\\circ}", "1"],
    ["\\sin{240^\\circ}", "-\\frac{\\sqrt{3}}{2}"],
    ["\\cos{240^\\circ}", "-\\frac{1}{2}"],
    ["\\tan{240^\\circ}", "\\sqrt{3}"],
    ["\\sin{270^\\circ}", "-1"],
    ["\\cos{270^\\circ}", "0"],
    ["\\tan{270^\\circ}", "\\text{値なし}"],
    ["\\sin{300^\\circ}", "-\\frac{\\sqrt{3}}{2}"],
    ["\\cos{300^\\circ}", "\\frac{1}{2}"],
    ["\\tan{300^\\circ}", "-\\sqrt{3}"],
    ["\\sin{315^\\circ}", "-\\frac{1}{\\sqrt{2}}"],
    ["\\cos{315^\\circ}", "\\frac{1}{\\sqrt{2}}"],
    ["\\tan{315^\\circ}", "-1"],
    ["\\sin{330^\\circ}", "-\\frac{1}{2}"],
    ["\\cos{330^\\circ}", "\\frac{\\sqrt{3}}{2}"],
    ["\\tan{330^\\circ}", "-\\frac{1}{\\sqrt{3}}"],
    ["\\sin{360^\\circ}", "0"],
    ["\\cos{360^\\circ}", "1"],
    ["\\tan{360^\\circ}", "0"] //51
  ];
  const upper_bound = flag_value === 1 ? 27 : trifunc_values.length;
  let [ques, ans] = trifunc_values[Math.floor(Math.random() * upper_bound)];


  return [ques, ans];
}

// 2次関数グラフ
// 三角方程式
// 微分
// 不定積分
// 定積分

/* ************************************************************************************** */
/** 数学の関数 */

// ランダムな整数の生成
function generate_integers(number, range, include_zero = true) {
  if (number <= 0 || range < 1) {
    throw new Error("個数は1以上、範囲は1以上の整数で指定してください");
  }

  const zero_flag = include_zero ? 1 : 0;

  const integers = [];
  for (let i = 0; i < number; i++) {
    let num = Math.floor(Math.random() * (2 * range + zero_flag)) - range;

    if (!include_zero && num >= 0) {
      num += 1;
    }

    integers.push(num);
  }

  return integers;
}

// 互いに素である整数の組をランダム生成
function generate_coprime_integers(range) {
  const number = generate_integers(2, range, false);
  return gcd(...number) == 1 ? number : generate_coprime_integers(range);
}


// 2つの数の最大公約数
function gcd_2(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

// 複数の整数の最大公約数
function gcd(...numbers) {
  if (numbers.length === 0) {
    throw new Error("引数が0");
  }

  if (numbers.length === 1) {
    return Math.abs(numbers[0]);
  }
  return numbers.reduce((acc, val) => gcd_2(acc, val));
}

// 根号の中の数を小さくする
function simplify_sqrt_root(input_number) {
  if (input_number <= 0) return "negative number"; // 正の整数のチェック
  let out_num = 1; // 根号の外に出る数
  let in_num = input_number; // 根号内の数

  for (let i = 2; i * i <= input_number; i++) {
    while (in_num % (i * i) === 0) {
      out_num *= i;
      in_num /= i * i;
    }
  }

  return [out_num, in_num];
}

/* ************************************************************************************** */
/* 数学用変換 */

// 係数変換
function transport_monomial(number, variable) {
  const monomial = (number === 1 ? "" : number === -1 ? "-" : number) + variable;
  return monomial;
}



/* ************************************************************************************** */
/** LaTeXへの変換 */

// 多項式
function transport_polynomial_latex(...coefficients) {
  const degree = coefficients.length - 1;
  let polynomial = "";

  coefficients.forEach((coef, i) => {
    const power = degree - i;

    // 係数が0の場合 項を無くす
    if (coef === 0) return;

    // 多項式内の+記号
    if (polynomial !== "") {
      polynomial += coef > 0 ? "+" : "";
    }

    // 各項の処理
    if (power === 0) {
      polynomial += coef;
    } else {
      polynomial += (coef === 1 ? "" : coef === -1 ? "-" : coef);
      polynomial += power === 1 ? "x" : `x^{${power}}`;
    }
  });

  return polynomial;
}

// 分数
function transport_fraction_latex(numerator, denominator) {
  if (denominator === 0) {
    throw new Error("分母が0");
  }

  let fraction = "";

  // 符号
  fraction = numerator * denominator < 0 ? "-" : "";

  let nu = Math.abs(numerator);
  let de = Math.abs(denominator);
  let d = gcd(nu, de);

  nu = nu / d;
  de = de / d;

  // 分母が1なら整数として返す
  if (de === 1) {
    fraction += nu;
  } else {
    fraction += `\\frac{${nu}}{${de}}`;
  }

  return fraction;
}


/* ************************************************************************************** */
/* LaTeX 文書のレイアウト生成 */
function layout_latexdoc(array_q, array_a) {
  const preamble = document.getElementById("latex_preamble").value === "no" ? false : true;
  const num_col = document.getElementById("number_columns").value;
  const num_ques = array_q.length;

  let output_latex_source_code = "";

  if (preamble) {
    output_latex_source_code += `
%\\documentclass[b5paper,10pt]{article}
\\documentclass[b5paper,10pt]{ltjsarticle}
\\usepackage[top=20truemm,bottom=10truemm,left=10truemm,right=10truemm]{geometry}

\\usepackage{fancyhdr}
\\pagestyle{fancy}
%\\fancyhead[L]{Exercises \\quad {\\tiny \\today}}
\\fancyhead[L]{演習 \\quad {\\tiny \\today}}
%\\fancyhead[R]{Class\\hspace{30pt}No\\hspace{30pt}Name\\hspace{100pt} \\qquad / ${num_ques} }
\\fancyhead[R]{クラス\\hspace{30pt} 番号\\hspace{30pt} 氏名\\hspace{100pt} \\qquad / ${num_ques} }
\\fancyfoot{}

\\renewcommand{\\labelenumi}{(\\theenumi)}
%\\renewcommand{\\baselinestretch}{8}

\\usepackage{multicol}

\\begin{document}
\\small
`;

  }

  for (let j = 0; j < 2; j++) {

    if (preamble) {
      if (num_col < 2) { output_latex_source_code += "%"; }
      output_latex_source_code += `\\begin{multicols}{${num_col}}\n`;
    }

    output_latex_source_code += `\\begin{enumerate}
\\setlength{\\itemsep}{11pt}
`;
    for (let i = 0; i < num_ques; i++) {
      output_latex_source_code += "\\item $" + array_q[i] + "$ \\\\\n";
      if (j === 0) {
        output_latex_source_code += "\\phantom{$" + array_a[i] + "$}\n";
      } else {
        output_latex_source_code += "$" + array_a[i] + "$\n";
      }
    }

    output_latex_source_code += "\\end{enumerate}\n";

    if (preamble) {
      if (num_col < 2) { output_latex_source_code += "%"; }
      output_latex_source_code += "\\end{multicols}\n";
    }

    if (j === 0) { output_latex_source_code += "\n% % % % % % % % % %\n\\newpage\n% % % % % % % % % %\n\n"; }
  }

  if (preamble) {
    output_latex_source_code += "\\end{document}";
  }

  return output_latex_source_code;

}


/* MathJax用 文書のレイアウト生成 */
function layout_mathjax_latexdoc(array_q, array_a) {
  const num_ques = array_q.length;
  let output_mathjax_latex_image_code = "";

  for (let j = 0; j < 2; j++) {
    output_mathjax_latex_image_code += j === 0 ? "<h3>問題</h3>" : "<h3>解答</h3>";

    output_mathjax_latex_image_code += j === 0 ? '<ol id="question">' : '<ol>';

    for (let i = 0; i < num_ques; i++) {
      output_mathjax_latex_image_code += "<li><p>\\(" + array_q[i] + "\\)</p>";
      if (j === 1) {
        output_mathjax_latex_image_code += "<p>\\(" + array_a[i] + "\\)</p>";
      }
      output_mathjax_latex_image_code += "</li>";

    }
    output_mathjax_latex_image_code += "</ol>";
  }

  return output_mathjax_latex_image_code;
}


