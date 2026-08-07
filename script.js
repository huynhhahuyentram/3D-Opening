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
// Hàm hỗ trợ đọc số an toàn (xóa dấu phân cách hàng nghìn nếu gõ thủ công)
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
    if (/^-?\d+[.,]\d{3}$/.test(raw)) {
        raw = raw.replace(/[.,]/g, '');
    } else {
        raw = raw.replace(',', '.');
    }
    
    return parseFloat(raw) || 0;
}

@@ -78,7 +62,7 @@

    let x0 = 50, y0 = 220;

    // Trục X (Đỏ)
    // Trục X (Đỏ) - Nằm ngang sang phải
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
@@ -87,7 +71,7 @@
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 4);

    // Trục Y (Xanh dương)
    // Trục Y (Xanh dương) - Nghiêng 45 độ sang phải
    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
@@ -96,7 +80,7 @@
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 38);

    // Trục Z (Xanh lá)
    // Trục Z (Xanh lá) - Thẳng đứng lên trên
    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
@@ -115,25 +99,29 @@
    };
}

/* 3. VẼ HÌNH HỘP CHỮ NHẬT 3D PHẲNG KHÔNG BO GÓC */
/* 3. VẼ HÌNH HỘP CHỮ NHẬT 3D PHẲNG KHÔNG BO GÓC (THEO HÌNH 2) */
function drawBox3DSharp(cx, cy, d1, d2, d3, lbl1, lbl2, lbl3) {
    ctx.lineWidth = 1.8;
    let offsetX = cx - d1 / 2;
    let offsetY = cy + d3 / 2;

    // Tọa độ 4 đỉnh mặt đáy (z = 0)
    let b0 = projectISO(0, 0, 0, offsetX, offsetY);
    let b1 = projectISO(d1, 0, 0, offsetX, offsetY);
    let b2 = projectISO(d1, d2, 0, offsetX, offsetY);
    let b3 = projectISO(0, d2, 0, offsetX, offsetY);

    // Tọa độ 4 đỉnh mặt đỉnh (z = d3)
    let t0 = projectISO(0, 0, d3, offsetX, offsetY);
    let t1 = projectISO(d1, 0, d3, offsetX, offsetY);
    let t2 = projectISO(d1, d2, d3, offsetX, offsetY);
    let t3 = projectISO(0, d2, d3, offsetX, offsetY);

    // Dynamic stroke style & Color
    ctx.strokeStyle = "#0000ff";
    ctx.fillStyle = "rgba(59, 130, 246, 0.12)";

    // 1. Vẽ mặt phẳng đáy
    ctx.beginPath();
    ctx.moveTo(b0.x, b0.y);
    ctx.lineTo(b1.x, b1.y);
@@ -143,6 +131,7 @@
    ctx.stroke();
    ctx.fill();

    // 2. Vẽ 4 cạnh dọc thẳng đứng nối đáy và đỉnh
    let bEdges = [b0, b1, b2, b3];
    let tEdges = [t0, t1, t2, t3];
    for (let i = 0; i < 4; i++) {
@@ -152,6 +141,7 @@
        ctx.stroke();
    }

    // 3. Vẽ mặt phẳng đỉnh
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
@@ -161,6 +151,7 @@
    ctx.stroke();
    ctx.fill();

    // 4. Hiển thị thông số kích thước (L, W, H)
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px Segoe UI";

@@ -179,136 +170,101 @@
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
    log("🤖 Xin chào, tôi có thể giúp gì cho bạn");

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
    // Phát lời chào trước, khi nói xong mới bắt đầu bật Micro để không bị thu nhiễu
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance("Xin chào, tôi có thể giúp gì cho bạn");
    u.lang = "vi-VN";
    u.rate = 0.95;

    u.onend = () => {
        log("🔴 <i>Đang nghe...</i>");
        let r = new SR();
        r.lang = "vi-VN"; 
        r.continuous = false;
        r.interimResults = false;

        r.onresult = e => {
            let text = e.results[0][0].transcript;
            processFullVoiceNLP(text);
        };

        r.onerror = () => {
            log("🤖 File của bạn đã được tạo xong");
            speak("File của bạn đã được tạo xong");
        };

        r.start();
    };

    recognition.start();
}

function resetVoiceBtn() {
    const btnVoice = document.querySelector(".voice");
    if (btnVoice) btnVoice.style.opacity = "1";
    window.speechSynthesis.speak(u);
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
    
    // Chuẩn hóa từ ngữ tự nhiên sang định dạng chuẩn
    let str = t.toLowerCase()
               .replace(/\b(âm|trừ)\b/g, "-")
               .replace(/\bphẩy\b/g, ",")
               .replace(/\bchấm\b/g, ".");

    // Hàm chuyển chữ số Tiếng Việt thông dụng thành số (nếu có)
    const textToNumMap = {
        "không": "0", "một": "1", "hai": "2", "ba": "3", "bốn": "4", 
        "năm": "5", "sáu": "6", "bảy": "7", "tám": "8", "chín": "9", "mười": "10"
    };
    for (let key in textToNumMap) {
        let regexWord = new RegExp(`\\b${key}\\b`, "g");
        str = str.replace(regexWord, textToNumMap[key]);
    }
    let updatedCount = 0;

    // Làm sạch và ép kiểu chuỗi số thu được
    // Hàm làm sạch chuỗi số (xử lý số âm, số thập phân -2007,5 hay -2007.5)
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
        numStr = numStr.trim();
        if (/^-?\d+[.,]\d{3}$/.test(numStr)) {
            return numStr.replace(/[.,]/g, '');
        }
        return numStr;
        return numStr.replace(',', '.');
    };

    // Tìm giá trị theo từ khóa mở
    const findVal = (keywords) => {
        for (let kw of keywords) {
            let regex = new RegExp(`${kw}(?:\\s+là|\\s+bằng|\\s*[:=])?\\s*(-?\\s*\\d+(?:[.,]\\d+)*)`, "i");
            let regex = new RegExp(`${kw}(?:\\s+là|\\s+bằng|\\s*[:=])?\\s*(-?\\s*\\d+(?:[.,]\\d+)?)`, "i");
            let match = str.match(regex);
            if (match) return cleanNumberString(match[1]);
            if (match) {
                let valStr = match[1].replace(/\s+/g, '');
                return cleanNumberString(valStr);
            }
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
    // 1. Nhận diện Orientation (X, Y, Z)
    if (str.includes("hướng x") || str.includes("trục x") || str.includes("ori x")) setOri('X');
    else if (str.includes("hướng y") || str.includes("trục y") || str.includes("ori y")) setOri('Y');
    else if (str.includes("hướng z") || str.includes("trục z") || str.includes("ori z")) setOri('Z');

    // 2. Nhận diện Position (Tọa độ)
    // 2. Nhận diện Position (X, Y, Z)
    let posX = findVal(["vị trí x", "pos x", "tọa độ x", "position x", "x"]);
    let posY = findVal(["vị trí y", "pos y", "tọa độ y", "position y", "y"]);
    let posZ = findVal(["vị trí z", "pos z", "tọa độ z", "position z", "z"]);

    if (posX !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("px").value = posX; updatedCount++; }
    if (posY !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("py").value = posY; updatedCount++; }
    if (posZ !== null && (str.includes("vị trí") || str.includes("tọa độ") || str.includes("pos"))) { document.getElementById("pz").value = posZ; updatedCount++; }
    if (posX !== null) { document.getElementById("px").value = posX; updatedCount++; }
    if (posY !== null) { document.getElementById("py").value = posY; updatedCount++; }
    if (posZ !== null) { document.getElementById("pz").value = posZ; updatedCount++; }

    // 3. Nhận diện Dimension (Kích thước)
    let len = findVal(["chiều dài", "độ dài", "dài", "length"]);
    let wid = findVal(["chiều rộng", "độ rộng", "rộng", "width"]);
    let hei = findVal(["chiều cao", "độ cao", "cao", "height"]);
    // 3. Nhận diện Dimension (L, W, H)
    let len = findVal(["chiều dài", "độ dài", "dài", "length", "l"]);
    let wid = findVal(["chiều rộng", "độ rộng", "rộng", "width", "w"]);
    let hei = findVal(["chiều cao", "độ cao", "cao", "height", "h"]);

    if (len !== null) { document.getElementById("dx").value = len; updatedCount++; }
    if (wid !== null) { document.getElementById("dy").value = wid; updatedCount++; }
    if (hei !== null) { document.getElementById("dz").value = hei; updatedCount++; }

    // 4. Nhận diện Corner Radius (Bo góc)
    // 4. Nhận diện Corner Radius (R1, R2, R3, R4)
    let rad1 = findVal(["r1", "radius 1", "bo góc 1", "bán kính 1"]);
    let rad2 = findVal(["r2", "radius 2", "bo góc 2", "bán kính 2"]);
    let rad3 = findVal(["r3", "radius 3", "bo góc 3", "bán kính 3"]);
@@ -328,9 +284,9 @@
        updatedCount++;
    }

    // 5. Nếu đọc tự do các dãy số liên tiếp (Ví dụ: "2000 1000 -3000" hoặc "-2007,5 1500 800")
    // 5. Nếu nói chuỗi số tự do (Ví dụ: "-2007.5 1000 500")
    if (updatedCount === 0) {
        let rawNums = str.match(/-?\d+(?:[.,]\d+)*/g);
        let rawNums = str.match(/-?\d+([.,]\d+)?/g);
        if (rawNums && rawNums.length >= 3) {
            document.getElementById("dx").value = cleanNumberString(rawNums[0]);
            document.getElementById("dy").value = cleanNumberString(rawNums[1]);
@@ -341,23 +297,21 @@

    if (updatedCount > 0) {
        draw();
        speak("Cập nhật thông số thành công");
        log("🤖 <b>Cập nhật thông số thành công!</b>");
    } else {
        speak("Chưa nhận diện được thông số, vui lòng thử lại!");
        log("🤖 <i>Chưa nhận diện được thông số, vui lòng thử lại!</i>");
    }
    
    speak("File của bạn đã được tạo xong");
    log("🤖 File của bạn đã được tạo xong");
}

function speak(t) {
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(t);
    u.lang = "vi-VN";
    u.rate = 1.0;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
}

/* 6. XUẤT FILE .MAC CHUẨN */
/* 4. CHỈNH SỬA CHUẨN ORI KHI XUẤT FILE .MAC THEO ĐÚNG HƯỚNG ĐƯỢC CHỌN */
function saveFile() {
    let px = parseInputValue("px");
    let py = parseInputValue("py");
@@ -372,6 +326,7 @@
    let r3 = parseInputValue("r3");
    let r4 = parseInputValue("r4");

    // Xác định chính xác chuỗi ORI theo biến ORI đang được chọn
    let oriStr = "ORI Y is Y and Z is Z";
    if (ORI === "X") {
        oriStr = "ORI Y is Y and Z is X";
@@ -424,7 +379,7 @@
    let blob = new Blob([data], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "3D Opening.mac";
    a.download = "Opening.mac";
    a.click();
}

@@ -440,16 +395,15 @@
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
