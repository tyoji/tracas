
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
      break;
    case "multi_int":
      [ques, ans] = multiplication_integers(int_val);
      break;
    case "add_poly":
      [ques, ans] = addition_polynomials(int_val);
      break;
    case "multi_poly":
      [ques, ans] = multiplication_polynomials(int_val);
      break;
    case "factorization_poly":
      [ans, ques] = multiplication_polynomials(int_val);
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
  const coefficients = generate_integers(2, range, false);
  let ques = coefficients[0];
  let ans;

  if (Math.floor(Math.random() * 2) === 0) {
    ques += "+";
    ans = coefficients[0] + coefficients[1];
  } else {
    ques += "-";
    ans = coefficients[0] - coefficients[1];
  }
  if (coefficients[1] < 0) {
    ques += "(" + coefficients[1] + ")";
  } else {
    ques += coefficients[1];
  }
  return [ques, ans];
}

// 問題作成 整数の乗法
function multiplication_integers(range) {
  const coefficients = generate_integers(2, range, false);
  let ques = coefficients[0] + " \\times ";
  let ans;

  if (coefficients[1] < 0) {
    ques += "(" + coefficients[1] + ")";
  } else {
    ques += "" + coefficients[1] + "";
  }
  ans = coefficients[0] * coefficients[1];

  return [ques, ans];
}


// 問題作成 多項式の加法
function addition_polynomials(range) {
  const coefficients = [...generate_integers(2, range, false), ...generate_integers(4, range)];
  let ques, ans;
  const polynomial_1 = transport_polynomial_latex(coefficients[0], coefficients[2], coefficients[4]);
  const polynomial_2 = transport_polynomial_latex(coefficients[1], coefficients[3], coefficients[5]);

  if (Math.floor(Math.random() * 2) === 0) {
    ques = "(" + polynomial_1 + ")+(" + polynomial_2 + ")";
    ans = transport_polynomial_latex(coefficients[0] + coefficients[1], coefficients[2] + coefficients[3], coefficients[4] + coefficients[5]);
  } else {
    ques = "(" + polynomial_1 + ")-(" + polynomial_2 + ")";
    ans = transport_polynomial_latex(coefficients[0] - coefficients[1], coefficients[2] - coefficients[3], coefficients[4] - coefficients[5]);
  }
  return [ques, ans];
}

// 問題作成 多項式の乗法
function multiplication_polynomials(range) {
  const coefficients = generate_integers(4, range, false);
  let ques, ans;
  let coeff_p1_1, coeff_p1_2, coeff_p2_1, coeff_p2_2;
  coeff_p1_1 = coefficients[0] / gcd(coefficients[0], coefficients[2]);
  coeff_p1_2 = coefficients[2] / gcd(coefficients[0], coefficients[2]);
  coeff_p2_1 = coefficients[1] / gcd(coefficients[1], coefficients[3]);
  coeff_p2_2 = coefficients[3] / gcd(coefficients[1], coefficients[3]);

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
    fraction += `\\frac{${nu} } {${de} } `;
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
\\documentclass[b5paper,10pt]{article}
%\\documentclass[b5paper,10pt]{ltjsarticle}
\\usepackage[top=20truemm,bottom=10truemm,left=10truemm,right=10truemm]{geometry}

\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhead[L]{Exercises \\quad {\\tiny \\today}}
\\fancyhead[R]{Class\\hspace{30pt}No\\hspace{30pt}Name\\hspace{100pt} \\qquad / ${num_ques} }

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
        output_latex_source_code += "\\phantom{$=" + array_a[i] + "$}\n";
      } else {
        output_latex_source_code += "$=" + array_a[i] + "$\n";
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
    output_mathjax_latex_image_code += "<ol>";

    for (let i = 0; i < num_ques; i++) {
      output_mathjax_latex_image_code += "<li>\\(" + array_q[i];
      if (j === 1) {
        output_mathjax_latex_image_code += "=" + array_a[i];
      }
      output_mathjax_latex_image_code += "\\)</li>";

    }
    output_mathjax_latex_image_code += "</ol>";
  }

  return output_mathjax_latex_image_code;
}


