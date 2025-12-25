const fs = require("fs");

const s = fs.readFileSync("obfuscated.js", "utf8");
let st = [];
let inS = 0, inD = 0, inT = 0, esc = 0;

for (let i = 0; i < s.length; i++) {
    const c = s[i];

    // inside string?
    if (inS || inD || inT) {
        if (esc) { esc = 0; continue; }
        if (c === "\\") { esc = 1; continue; }
        if (inS && c === "'") inS = 0;
        else if (inD && c === '"') inD = 0;
        else if (inT && c === "`") inT = 0;
        continue;
    }

    // enter string
    if (c === "'") { inS = 1; continue; }
    if (c === '"') { inD = 1; continue; }
    if (c === "`") { inT = 1; continue; }

    // skip // comments
    if (c === "/" && s[i + 1] === "/") {
        while (i < s.length && s[i] !== "\n") i++;
        continue;
    }

    // skip /* */ comments
    if (c === "/" && s[i + 1] === "*") {
        i += 2;
        while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
        i++;
        continue;
    }

    // push openers
    if (c === "{" || c === "(" || c === "[") st.push([c, i]);

    // pop closers
    if (c === "}" || c === ")" || c === "]") {
        const m = { "}": "{", ")": "(", "]": "[" }[c];
        const last = st.pop();
        if (!last || last[0] !== m) {
            console.log("MISMATCH at char", i, "got", c, "expected", m);
            console.log("CONTEXT:", s.slice(Math.max(0, i - 60), i + 60));
            process.exit(0);
        }
    }
}

if (st.length) {
    const [o, pos] = st[st.length - 1];
    console.log("UNCLOSED", o, "opened at char", pos);
    console.log("CONTEXT:", s.slice(Math.max(0, pos - 60), pos + 60));
} else {
    console.log("BRACKETS OK");
}
