const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o.toLowerCase()).classList.add("active");
    draw();
}

// Hàm hỗ trợ đọc số an toàn (xóa dấu phân cách hàng nghìn, xử lý số âm & thập phân)
function parseInputValue(id) {
    let raw = (document.getElementById(id).value || "").toString().trim();
    if (!raw) return 0;
    
    // Loại bỏ khoảng trắng
    raw = raw.replace(/\s+/g, '');
    
    // Xử lý dạng hàng nghìn có phẩy/chấm (vd: -2.007,5 hoặc -2,007.5 hoặc -2007,5)
    if (/^-?\d{1,3}([.,]\d{3})+([.,]\d+)?$/.test(raw)) {
        if (raw.includes(',') && raw.includes('.')) {
            if (raw.indexOf('.') < raw.indexOf(',')) {
                raw = raw.replace(/\./g, '').replace(',', '.');
            } else {
                raw = raw.replace(/,/g, '');
            }
        } else if (raw.includes('.')) {
            raw = raw.replace(/\./g, '');
        } else if (raw.includes(',')) {
            raw = raw.replace(/,/g, '');
        }
    } else {
        raw = raw.replace(',', '.');
    }
    
    return parseFloat(raw) || 0;
}

function draw() {
    c.width = c.offsetWidth;
    c.height = 280;

    let L = parseInputValue("dx");
    let W = parseInputValue("dy");
    let H = parseInputValue("dz");

    ctx.clearRect(0, 0, c.width, c.height);

    drawAxis();

    if (L === 0 && W === 0 && H === 0) return;

    let maxDim = Math.max(Math.abs(L), Math.abs(W), Math.abs(H), 100);
    let scale = 110 / maxDim;

    let l = L * scale;
    let w = W * scale;
    let h = H * scale;

    let cx = c.width / 2 - 20;
    let cy = c.height / 2 + 30;

    if (ORI === "Z") {
        drawBox3DSharp(cx, cy, l, w, h, `L=${L}`, `W=${W}`, `H=${H}`);
    } else if (ORI === "X") {
        drawBox3DSharp(cx, cy, h, w, l, `H=${H}`, `W=${W}`, `L=${L}`);
    } else if (ORI === "Y") {
        drawBox3DSharp(cx, cy, l, h, w, `L=${L}`, `H=${H}`, `W=${W}`);
    }
}

/* 1. TRỤC TỌA ĐỘ CHUẨN */
function drawAxis() {
    ctx.lineWidth = 2.5;
    ctx.font = "bold 13px Segoe UI";

    let x0 = 50, y0 = 220;

    // Trục X (Đỏ)
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 50, y0);
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 4);

    // Trục Y (Xanh dương)
    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + 35, y0 - 35);
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 38);

    // Trục Z (Xanh lá)
    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, y0 - 50);
    ctx.stroke();
    ctx.fillText("Z", x0 - 4, y0 - 55);
}

/* 2. CHUYỂN ĐỔI TỌA ĐỘ ISOMETRIC CHUẨN */
function projectISO(x, y, z, cx, cy) {
    let kY = 0.55; 
    return {
        x: cx + x + y * kY,
        y: cy - z - y * kY
    };
}

/* 3. VẼ HÌNH HỘP CHỮ NHẬT 3D PHẲNG KHÔNG BO GÓC */
function drawBox3DSharp(cx, cy, d1, d2, d3, lbl1, lbl2, lbl3) {
    ctx.lineWidth = 1.8;
    let offsetX = cx - d1 / 2;
    let offsetY = cy + d3 / 2;

    let b0 = projectISO(0, 0, 0, offsetX, offsetY);
    let b1 = projectISO(d1, 0, 0, offsetX, offsetY);
    let b2 = projectISO(d1, d2, 0, offsetX, offsetY);
    let b3 = projectISO(0, d2, 0, offsetX, offsetY);

    let t0 = projectISO(0, 0, d3, offsetX, offsetY);
    let t1 = projectISO(d1, 0, d3, offsetX, offsetY);
    let t2 = projectISO(d1, d2, d3, offsetX, offsetY);
    let t3 = projectISO(0, d2, d3, offsetX, offsetY);

    ctx.strokeStyle = "#0000ff";
    ctx.fillStyle = "rgba(59, 130, 246, 0.12)";

    ctx.beginPath();
    ctx.moveTo(b0.x, b0.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.lineTo(b3.x, b3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    let bEdges = [b0, b1, b2, b3];
    let tEdges = [t0, t1, t2, t3];
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(bEdges[i].x, bEdges[i].y);
        ctx.lineTo(tEdges[i].x, tEdges[i].y);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px Segoe UI";

    let c1 = projectISO(d1 / 2, 0, 0, offsetX, offsetY);
    let c2 = projectISO(d1, d2 / 2, d3, offsetX, offsetY);
    let c3 = projectISO(0, 0, d3 / 2, offsetX, offsetY);

    ctx.fillText(lbl1, c1.x - 20, c1.y + 18);
    ctx.fillText(lbl2, c2.x - 15, c2.y - 8);
    ctx.fillText(lbl3, c3.x - 55, c3.y + 4);
}

function log(t) {
    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div>${t}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* 4. CHỨC NĂNG VOICE TỐI ƯU VÀ NGHỆ THUẬT NHẬN DIỆN */
let recognition = null;

function voice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        alert("Trình duyệt của bạn chưa hỗ trợ Voice!");
        return;
    }

    if (recognition) {
        try { recognition.stop(); } catch (e) {}
    }

    recognition = new SR();
    recognition.lang = "vi-VN"; 
    recognition.continuous = false; // Nghe xong 1 câu tự dừng
    recognition.interimResults = false;

    log("🔴 <i>Đang lắng nghe... Vui lòng nói thông số</i>");

    recognition.onstart = () => {
        const btnVoice = document.querySelector(".voice");
        if (btnVoice) btnVoice.style.opacity = "0.6";
    };

    recognition.onresult = e => {
        let text = e.results[0][0].transcript;
        processFullVoiceNLP(text);
    };

    recognition.onerror = e => {
        log("🤖 <i>Chưa nghe rõ giọng nói hoặc lỗi Micro, vui lòng thử lại!</i>");
        resetVoiceBtn();
    };

    recognition.onend = () => {
        resetVoiceBtn();
    };

    recognition.start();
}

function resetVoiceBtn() {
    const btnVoice = document.querySelector(".voice");
    if (btnVoice) btnVoice.style.opacity = "1";
}

/* 5. XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP) BẮT MỌI DẠNG SỐ VÀ CÚ PHÁP MỞ */
function processFullVoiceNLP(t) {
    log("👤 " + t);
    let str = t.toLowerCase();
    let updatedCount = 0;

    // Chuẩn hóa từ ngữ giọng nói sang ký tự toán học
    str = str.replace(/\b(âm|trừ)\b/g, "-")
             .replace(/\bphẩy\b/g, ",")
             .replace(/\bchấm\b/g, ".")
             .replace(/\bngàn\b/g, "nghìn");

    // Hàm chuyển chữ số Tiếng Việt thông dụng thành số (nếu có)
    const textToNumMap = {
        "không": "0", "một": "1", "hai": "2", "ba": "3", "bốn": "4", 
        "năm": "5", "sáu": "6", "bảy": "7", "tám": "8", "chín": "9", "mười": "10"
    };
    for (let key in textToNumMap) {
        let regexWord = new RegExp(`\\b${key}\\b`, "g");
        str = str.replace(regexWord, textToNumMap[key]);
    }

    // Làm sạch và ép kiểu chuỗi số thu được
    const cleanNumberString = (numStr) => {
        if (!numStr) return "0";
        numStr = numStr.trim().replace(/\s+/g, '');
        if (/^-?\d{1,3}([.,]\d{3})+([.,]\d+)?$/.test(numStr)) {
            if (numStr.includes(',') && numStr.includes('.')) {
                if (numStr.indexOf('.') < numStr.indexOf(',')) {
                    numStr = numStr.replace(/\./g, '').replace(',', '.');
                } else {
                    numStr = numStr.replace(/,/g, '');
                }
            } else if (numStr.includes('.')) {
                numStr = numStr.replace(/\./g, '');
            } else if (numStr.includes(',')) {
                numStr = numStr.replace(/,/g, '');
            }
        } else {
            numStr = numStr.replace(',', '.');
        }
        return numStr;
    };

    // Tìm giá trị theo từ khóa mở
    const findVal = (keywords) => {
        for (let kw of keywords) {
            let regex = new RegExp(`${kw}(?:\\s+là|\\s+bằng|\\s*[:=])?\\s*(-?\\s*\\d+(?:[.,]\\d+)*)`, "i");
            let match = str.match(regex);
            if (match) return cleanNumberString(match[1]);
        }
        return null;
    };

    // 1. Nhận diện Orientation (Hướng)
    let oriX = str.match(/\b(hướng|trục|orientation)\s*x\b/) || str.match(/\bx\b/);
    let oriY = str.match(/\b(hướng|trục|orientation)\s*y\b/);
    let oriZ = str.match(/\b(hướng|trục|orientation)\s*z\b/);
    
    if (str.includes("trục x") || str.includes("hướng x")) { setOri('X'); updatedCount++; }
    else if (str.includes("trục y") || str.includes("hướng y")) { setOri('Y'); updatedCount++; }
    else if (str.includes("trục z") || str.includes("hướng z")) { setOri('Z'); updatedCount++; }

    // 2. Nhận diện Position (Tọa độ)
    let posX = findVal(["vị trí x", "pos x", "tọa độ x", "position x", "x"]);
    let posY = findVal(["vị trí y", "pos y", "tọa độ y", "position y", "y"]);
    let posZ = findVal(["vị trí z", "pos z", "tọa độ z", "position z", "z"]);

    if (posX !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("px").value = posX; updatedCount++; }
    if (posY !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("py").value = posY; updatedCount++; }
    if (posZ !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("pz").value = posZ; updatedCount++; }

    // 3. Nhận diện Dimension (Kích thước)
    let len = findVal(["chiều dài", "độ dài", "dài", "length"]);
    let wid = findVal(["chiều rộng", "độ rộng", "rộng", "width"]);
    let hei = findVal(["chiều cao", "độ cao", "cao", "height"]);

    if (len !== null) { document.getElementById("dx").value = len; updatedCount++; }
    if (wid !== null) { document.getElementById("dy").value = wid; updatedCount++; }
    if (hei !== null) { document.getElementById("dz").value = hei; updatedCount++; }

    // 4. Nhận diện Corner Radius (Bo góc)
    let rad1 = findVal(["r1", "radius 1", "bo góc 1", "bán kính 1"]);
    let rad2 = findVal(["r2", "radius 2", "bo góc 2", "bán kính 2"]);
    let rad3 = findVal(["r3", "radius 3", "bo góc 3", "bán kính 3"]);
    let rad4 = findVal(["r4", "radius 4", "bo góc 4", "bán kính 4"]);
    let radAll = findVal(["bo góc", "bán kính", "radius", "r"]);

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

    // 5. Nếu đọc tự do các dãy số liên tiếp (Ví dụ: "2000 1000 -3000" hoặc "-2007,5 1500 800")
    if (updatedCount === 0) {
        let rawNums = str.match(/-?\d+(?:[.,]\d+)*/g);
        if (rawNums && rawNums.length >= 3) {
            document.getElementById("dx").value = cleanNumberString(rawNums[0]);
            document.getElementById("dy").value = cleanNumberString(rawNums[1]);
            document.getElementById("dz").value = cleanNumberString(rawNums[2]);
            updatedCount = 3;
        }
    }

    if (updatedCount > 0) {
        draw();
        speak("Cập nhật thông số thành công");
        log("🤖 <b>Cập nhật thông số thành công!</b>");
    } else {
        speak("Chưa nhận diện được thông số, vui lòng thử lại!");
        log("🤖 <i>Chưa nhận diện được thông số, vui lòng thử lại!</i>");
    }
}

function speak(t) {
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(t);
    u.lang = "vi-VN";
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
}

/* 6. XUẤT FILE .MAC CHUẨN */
function saveFile() {
    let px = parseInputValue("px");
    let py = parseInputValue("py");
    let pz = parseInputValue("pz");

    let L = parseInputValue("dx");
    let W = parseInputValue("dy");
    let H = parseInputValue("dz");

    let r1 = parseInputValue("r1");
    let r2 = parseInputValue("r2");
    let r3 = parseInputValue("r3");
    let r4 = parseInputValue("r4");

    let oriStr = "ORI Y is Y and Z is Z";
    if (ORI === "X") {
        oriStr = "ORI Y is Y and Z is X";
    } else if (ORI === "Y") {
        oriStr = "ORI Y is -X and Z is Y";
    } else if (ORI === "Z") {
        oriStr = "ORI Y is Y and Z is Z";
    }

    let data = `NEW EQUIPMENT
USRCOG ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
USRWCO ( X ( 0 ) Y ( 0 ) Z ( 0 ) )
POS X ${px}mm Y ${py}mm Z ${pz}mm
${oriStr}
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
    a.download = "3D Opening.mac";
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
    document.getElementById("chat").innerHTML = "";
}

function help() {
    window.open("https://drive.google.com/file/d/14NNDzXSCG63m1yQZb51tZhrZfd5k8KPf/view?usp=sharing");
}

document.querySelectorAll("input").forEach(i => {
    i.addEventListener("input", draw);
});

window.addEventListener("resize", draw);
draw();
