(function () {
  const roots = document.querySelectorAll(".selector");
  if (!roots.length) return;

  roots.forEach(root => {
    const config = root.dataset.config;
    const mode = root.dataset.mode || "normal";
    const data = window.SELECTOR_DATA?.[config];
    if (!data) return;

    const state = {};
    const base = data.base;

    const DEFAULTS = {
      minimal: { j1: "none", j2: "none", connector: "J4(Pi Disp) or CN4(DP)" },
      weston:  { j1: "none", j2: "none", connector: "J4(Pi Disp) or CN4(DP) or 'J4(Pi Disp) and CN4(DP)'" },
      debian:  { j1: "none", j2: "none", connector: "J4(Pi Disp) or CN4(DP)" }
    };

    for (const key in data.options) {
      state[key] = DEFAULTS[mode]?.[key] ?? "none";

      const block = document.createElement("div");
      block.className = "selector-block";
      block.innerHTML = `${data.options[key].label}`;
      block.dataset.key = key;

      for (const choice in data.options[key].choices) {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.dataset.value = choice;

	if (choice === state[key]) {
          btn.classList.add("selected");
        }

        btn.addEventListener("click", () => {
          state[key] = choice;

          block.querySelectorAll("button").forEach(b =>
            b.classList.remove("selected")
          );
          btn.classList.add("selected");

          updateResult();
        });

        block.appendChild(btn);
      }

      root.appendChild(block);
    }

    const result = document.createElement("div");
    result.className = "result";

    const resultText = document.createElement("div");
    resultText.className = "result-text";

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-bash";

    pre.appendChild(code);
    result.appendChild(resultText);
    result.appendChild(pre);
    root.appendChild(result);

    let updateResult;

    if (mode === "minimal" || mode === "debian") {
      updateResult = function () {
        let outputLines = [];

        if (state.connector === "none") {
          resultText.textContent = "command:";
          code.textContent = "";
          return;
        }

        const cameras = [];
	if (state.j1 !== "none") cameras.push({ port: "J1", choice: state.j1 });
        if (state.j2 !== "none") cameras.push({ port: "J2", choice: state.j2 });

        if (cameras.length === 0) {
          resultText.textContent = "command:";
          code.textContent = "";
          return;
        }

        if (state.connector === "J4(Pi Disp) or CN4(DP)") {
          cameras.forEach((cam, index) => {
            const camIndex = index + 1;
            outputLines.push(`Connect camera to ${cam.port}: cam -c ${camIndex} -C -D`);
          });
        } else if (state.connector === "J4(Pi Disp) and CN4(DP)") {

          outputLines.push("(You want to display J4(Pi Disp))");
          cameras.forEach((cam, index) => {
            const camIndex = index + 1;
            outputLines.push(`Connect camera to ${cam.port}: cam -c ${camIndex} -C -D`);
          });

          outputLines.push("(You want to display CN4(DP))");
          cameras.forEach((cam, index) => {
            const camIndex = index + 1;
            outputLines.push(`Connect camera to ${cam.port}: cam -c ${camIndex} -C -DDP-1`);
          });
        }

        resultText.textContent = "command:";
        code.textContent = outputLines.join("\n");
      }
    } else if (mode === "weston") {
      updateResult = function () {
        const active = Object.values(state).filter(v => v !== "none").length;
        let output = "";
        for (const key in state) {
          const choice = state[key];
          const cmd = data.options[key].choices[choice];
          if (cmd) output += cmd + "\n";
        }

        resultText.textContent = "command:";
	code.textContent = output;
      }
    } else {
      updateResult = function () {

        const hasCamera =
          state.j1 !== "none" || state.j2 !== "none";

        resultText.textContent = "command:";
        code.textContent = "";

        if (!hasCamera) {
          return;
        }

        let output = base;

        for (const key in state) {
          const append = data.options[key].choices[state[key]];
          if (append) {
            output += append;
          }
        }

        resultText.textContent = "command:";
	code.textContent = output + "\"";
      }
    }

    updateResult();
  });
})();

