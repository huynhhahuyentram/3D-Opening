const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o.toLowerCase()).classList.add("active");
    draw();
}

function draw() {
    c.width = c.offsetWidth;
    c.height = 280;

    let L = +document.getElementById("dx").value || 0;
    let W = +document.getElementById("dy").value || 0;
    let H = +document.getElementById("dz").value || 0;

    let r1 = +document.getElementById("r1").value || 0;
    let r2 = +document.getElementById("r2").value || 0;
    let r3 = +document.getElementById("r3").value || 0;
    let r4 = +document.getElementById("r4").value || 0;

    ctx.clearRect(0, 0, c.width, c.height);

    drawAxis();

    if (L === 0 && W === 0 && H === 0) return;

    let maxDim = Math.max(L, W, H, 100);
    let scale = 110 / maxDim;

    let l = L * scale;
    let w = W * scale;
    let h = H * scale;

    let cx = c.width / 2 - 20;
    let cy = c.height / 2 + 30;

    if (ORI === "Z") {
        let R1 = Math.min(r1 * scale, l / 2, w / 2);
        let R2 = Math.min(r2 * scale, l / 2, w / 2);
        let R3 = Math.min(r3 * scale, l / 2, w / 2);
        let R4 = Math.min(r4 * scale, l / 2, w / 2);
        drawBox3D(cx, cy, l, w, h, R1, R2, R3, R4, `L = ${L}`, `W = ${W}`, `H = ${H}`);
    } else if (ORI === "X") {
        let R1 = Math.min(r1 * scale, w / 2, h / 2);
        let R2 = Math.min(r2 * scale, w / 2, h / 2);
        let R3 = Math.min(r3 * scale, w / 2, h / 2);
        let R4 = Math.min(r4 * scale, w / 2, h / 2);
        drawBox3D(cx, cy, w, h, l, R1, R2, R3, R4, `W = ${W}`, `H = ${H}`, `L = ${L}`);
    } else if (ORI === "Y") {
        let R1 = Math.min(r1 * scale, l / 2, h / 2);
        let R2 = Math.min(r2 * scale, l / 2, h / 2);
        let R3 = Math.min(r3 * scale, l / 2, h / 2);
        let R4 = Math.min(r4 * scale, l / 2, h / 2);
        drawBox3D(cx, cy, l, h, w, R1, R2, R3, R4, `L = ${L}`, `H = ${H}`, `W = ${W}`);
    }
}

function drawAxis() {
    ctx.lineWidth = 2.5;
    ctx.font = "bold 13px Segoe UI";

    let x0 = 50, y0 = 220;

    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 50, y0);
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 4);

    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 35, y0 - 35);
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 38);

    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - 50);
    ctx.stroke();
    ctx.fillText("Z", x0 - 4, y0 - 55);
}

function projectISO(x, y, z, cx, cy) {
    let kY = 0.55;
    return {
        x: cx + x + y * kY,
        y: cy - z - y * kY
    };
}

function pathLoop(ctx, d1, d2, zLvl, cx, cy, r1, r2, r3, r4) {
    let p0 = projectISO(0, 0, zLvl, cx, cy);
    let p1 = projectISO(d1, 0, zLvl, cx, cy);
    let p2 = projectISO(d1, d2, zLvl, cx, cy);
    let p3 = projectISO(0, d2, zLvl, cx, cy);

    ctx.beginPath();
    ctx.moveTo(projectISO(r1, 0, zLvl, cx, cy).x, projectISO(r1, 0, zLvl, cx, cy).y);

    ctx.lineTo(projectISO(d1 - r2, 0, zLvl, cx, cy).x, projectISO(d1 - r2, 0, zLvl, cx, cy).y);
    ctx.quadraticCurveTo(p1.x, p1.y, projectISO(d1, r2, zLvl, cx, cy).x, projectISO(d1, r2, zLvl, cx, cy).y);

    ctx.lineTo(projectISO(d1, d2 - r3, zLvl, cx, cy).x, projectISO(d1, d2 - r3, zLvl, cx, cy).y);
    ctx.quadraticCurveTo(p2.x, p2.y, projectISO(d1 - r3, d2, zLvl, cx, cy).x, projectISO(d1 - r3, d2, zLvl, cx, cy).y);

    ctx.lineTo(projectISO(r4, d2, zLvl, cx, cy).x, projectISO(r4, d2, zLvl, cx, cy).y);
    ctx.quadraticCurveTo(p3.x, p3.y, projectISO(0, d2 - r4, zLvl, cx, cy).x, projectISO(0, d2 - r4, zLvl, cx, cy).y);

    ctx.lineTo(projectISO(0, r1, zLvl, cx, cy).x, projectISO(0, r1, zLvl, cx, cy).y);
    ctx.quadraticCurveTo(p0.x, p0.y, projectISO(r1, 0, zLvl, cx, cy).x, projectISO(r1, 0, zLvl, cx, cy).y);
    ctx.closePath();
}

function drawBox3D(cx, cy, d1, d2, d3, r1, r2, r3, r4, lbl1, lbl2, lbl3) {
    ctx.lineWidth = 1.8;
    let offsetX = cx - d1 / 2;
    let offsetY = cy + d3 / 2;

    let gradTop = ctx.createLinearGradient(0, 0, 0, 250);
    gradTop.addColorStop(0, "rgba(59, 130, 246, 0.35)");
    gradTop.addColorStop(1, "rgba(147, 197, 253, 0.15)");

    ctx.strokeStyle = "#94a3b8";
    ctx.fillStyle = "rgba(241, 245, 249, 0.4)";
    pathLoop(ctx, d1, d2, 0, offsetX, offsetY, r1, r2, r3, r4);
    ctx.fill();
    ctx.stroke();

    let bEdge = [
        projectISO(r1, 0, 0, offsetX, offsetY),
        projectISO(d1 - r2, 0, 0, offsetX, offsetY),
        projectISO(d1, d2 - r3, 0, offsetX, offsetY),
        projectISO(r4, d2, 0, offsetX, offsetY)
    ];

    let tEdge = [
        projectISO(r1, 0, d3, offsetX, offsetY),
        projectISO(d1 - r2, 0, d3, offsetX, offsetY),
        projectISO(d1, d2 - r3, d3, offsetX, offsetY),
        projectISO(r4, d2, d3, offsetX, offsetY)
    ];

    ctx.strokeStyle = "#334155";
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(bEdge[i].x, bEdge[i].y);
        ctx.lineTo(tEdge[i].x, tEdge[i].y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#1e293b";
    ctx.fillStyle = gradTop;
    pathLoop(ctx, d1, d2, d3, offsetX, offsetY, r1, r2, r3, r4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px Segoe UI";

    let c1 = projectISO(d1 / 2, 0, 0, offsetX, offsetY);
    let c2 = projectISO(d1, d2 / 2, 0, offsetX, offsetY);
    let c3 = projectISO(0, 0, d3 / 2, offsetX, offsetY);

    ctx.fillText(lbl1, c1.x - 18, c1.y + 18);
    ctx.fillText(lbl2, c2.x + 8, c2.y + 4);
    ctx.fillText(lbl3, c3.x - 58, c3.y + 4);
}

function log(t) {
    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div>${t}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function voice() {
    speak("Xin chào, tôi có thể giúp gì cho bạn");
    log("🤖 Xin chào, tôi có thể giúp gì cho bạn");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        alert("Trình duyệt của bạn chưa hỗ trợ Voice!");
        return;
    }

    let r = new SR();
    r.lang = "vi-VN"; 
    r.continuous = false;
    r.interimResults = false;

    r.onresult = e => {
        let text = e.results[0][0].transcript;
        processFullVoiceNLP(text);
    };

    setTimeout(() => {
        r.start();
    }, 2200);
}

function processFullVoiceNLP(t) {
    log("👤 " + t);
    let str = t.toLowerCase();
    let updatedCount = 0;

    const findVal = (keywords) => {
        for (let kw of keywords) {
            let regex = new RegExp(`${kw}(?:\\s+là|\\s+bằng|\\s*[:=])?\\s*(-?\\d+(?:[.,]\\d+)?)`, "i");
            let match = str.match(regex);
            if (match) return match[1].replace(',', '.');
        }
        return null;
    };

    let posX = findVal(["vị trí x", "pos x", "tọa độ x", "position x"]);
    let posY = findVal(["vị trí y", "pos y", "tọa độ y", "position y"]);
    let posZ = findVal(["vị trí z", "pos z", "tọa độ z", "position z"]);

    if (posX !== null) { document.getElementById("px").value = posX; updatedCount++; }
    if (posY !== null) { document.getElementById("py").value = posY; updatedCount++; }
    if (posZ !== null) { document.getElementById("pz").value = posZ; updatedCount++; }

    let len = findVal(["chiều dài", "độ dài", "dài", "length"]);
    let wid = findVal(["chiều rộng", "độ rộng", "rộng", "width"]);
    let hei = findVal(["chiều cao", "độ cao", "cao", "height"]);

    if (len !== null) { document.getElementById("dx").value = len; updatedCount++; }
    if (wid !== null) { document.getElementById("dy").value = wid; updatedCount++; }
    if (hei !== null) { document.getElementById("dz").value = hei; updatedCount++; }

    let rad1 = findVal(["r1", "radius 1", "bo góc 1"]);
    let rad2 = findVal(["r2", "radius 2", "bo góc 2"]);
    let rad3 = findVal(["r3", "radius 3", "bo góc 3"]);
    let rad4 = findVal(["r4", "radius 4", "bo góc 4"]);
    let radAll = findVal(["bo góc", "bán kính", "radius"]);

    if (rad1 !== null) { document.getElementById("r1").value = rad1; updatedCount++; }
    if (rad2 !== null) { document.getElementById("r2").value = rad2; updatedCount++; }
    if (rad3 !== null) { document.getElementById("r3").value = rad3; updatedCount++; }
    if (rad4 !== null) { document.getElementById("r4").value = rad4; updatedCount++; }
    
    if (radAll !== null && rad1 === null && rad2 === null && rad3 === null && rad4 === null) {
        document.getElementById("r1").value = radAll;
        document.getElementById("r2").value = radAll;
        document.getElementById("r3").value = radAll;
        document.getElementById("r4").value = radAll;
        updatedCount++;
    }

    if (updatedCount === 0) {
        let rawNums = str.match(/\d+([.,]\d+)?/g);
        if (rawNums && rawNums.length >= 3) {
            document.getElementById("dx").value = rawNums[0].replace(',', '.');
            document.getElementById("dy").value = rawNums[1].replace(',', '.');
            document.getElementById("dz").value = rawNums[2].replace(',', '.');
            updatedCount = 3;
        }
    }

    if (updatedCount > 0) {
        draw();
        speak("File của bạn đã được tạo xong");
        log("🤖 File của bạn đã được tạo xong");
    } else {
        speak("Chưa nhận diện được thông số, vui lòng thử lại!");
        log("🤖 Chưa nhận diện được thông số, vui lòng thử lại!");
    }
}

function speak(t) {
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(t);
    u.lang = "vi-VN";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
}

function saveFile() {
    let px = +document.getElementById("px").value || 0;
    let py = +document.getElementById("py").value || 0;
    let pz = +document.getElementById("pz").value || 0;

    let L = +document.getElementById("dx").value || 0;
    let W = +document.getElementById("dy").value || 0;
    let H = +document.getElementById("dz").value || 0;

    let r1 = document.getElementById("r1").value || 0;
    let r2 = document.getElementById("r2").value || 0;
    let r3 = document.getElementById("r3").value || 0;
    let r4 = document.getElementById("r4").value || 0;

    let oriString = "ORI Y is Y and Z is Z";
    if (ORI === "X") {
        oriString = "ORI Y is Y and Z is X";[cite: 1]
    } else if (ORI === "Y") {
        oriString = "ORI Y is -X and Z is Y";[cite: 2]
    } else if (ORI === "Z") {
        oriString = "ORI Y is Y and Z is Z";[cite: 3]
    }

    let data = `NEW EQUIPMENT
USRCOG ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
USRWCO ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
POS X ${px}mm Y ${py}mm Z ${pz}mm
${oriString}
BUIL false
DSCO unset
PTSP unset
INSC unset

NEW EXTRUSION
ORI Y is -Y and Z is Z
LEVE 0 2
HEIG ${H}mm

NEW LOOP

NEW VERTEX
FRAD ${r1}mm

END
NEW VERTEX
POS X 0mm Y ${W}mm Z 0mm
FRAD ${r2}mm

END
NEW VERTEX
POS X ${L}mm Y ${W}mm Z 0mm
FRAD ${r3}mm

END
NEW VERTEX
POS X ${L}mm Y 0mm Z 0mm
FRAD ${r4}mm

END
END
END
END`;

    let blob = new Blob([data], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Opening_${ORI}.mac`;
    a.click();
}

function reset() {
    document.getElementById("px").value = 0;
    document.getElementById("py").value = 0;
    document.getElementById("pz").value = 0;
    document.getElementById("dx").value = 0;
    document.getElementById("dy").value = 0;
    document.getElementById("dz").value = 0;
    document.getElementById("r1").value = 150;
    document.getElementById("r2").value = 150;
    document.getElementById("r3").value = 150;
    document.getElementById("r4").value = 150;
    setOri('Z');
}

function help() {
    window.open("https://drive.google.com/file/d/14NNDzXSCG63m1yQZb51tZhrZfd5k8KPf/view?usp=sharing");
}

document.querySelectorAll("input").forEach(i => {
    i.addEventListener("input", draw);
});

window.addEventListener("resize", draw);
draw();
