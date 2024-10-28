import * as linear from "https://cdn.skypack.dev/linear-solve@1.2.1";
const functionContainer = document.getElementById("function");
const functionValuesContainer = document.getElementById("function-values");

document.getElementById("numbers").addEventListener("input", ({ target }) => {
    // 清除旧函数
    functionValuesContainer.innerHTML = "";
    functionContainer.innerHTML = "";

    const numbers = target.value.split(/[,，]/).map((number) => {
        const parsed = parseFloat(number);
        return isNaN(parsed) ? 114514 : parsed; // 仅当NaN时处理为问号
    });

    const exponents = Array(numbers.length)
        .fill(numbers.length - 1)
        .map((number, exponent) => number - exponent);

    const products = linear
        .solve(
            Array(numbers.length)
                .fill(0)
                .map((v, index) => exponents.map((exponent) => (index + 1) ** exponent)),
            [...numbers]
        )
        .map((solution, index, solutions) => {
            let product = "";
            if (solution) {
                if (index) product += solution > 0 ? "+" : "-";
                product += Math.abs(solution).toFixed(3);
                if (solutions.length - index - 1) {
                    product += "x";
                    if (solutions.length - index - 2) product += `^${exponents[index]}`;
                }
            }
            return product;
        });

    katex.render(`f(x) = ${products.join("")}`, functionContainer, {
        throwOnError: false,
    });

    for (let [index, number] of numbers.entries()) {
        const functionValue = document.createElement("li");
        if (number === 114514) functionValue.classList.add("homo-value");
        katex.render(`f(${index + 1}) = ${number}`, functionValue, {
            throwOnError: false,
        });
        functionValuesContainer.append(functionValue);
    }
});

document.getElementById("numbers").dispatchEvent(new InputEvent("input"));
