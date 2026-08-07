const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o.toLowerCase()).classList.add("active");
    draw();
}

// Hàm hỗ trợ đọc số an toàn (xóa dấu phân cách hàng nghìn nếu gõ thủ công)
function parseInputValue(id) {
    let raw = (document.getElementById(id).value || "").toString().trim();
    if (!raw) return 0;
@@ -62,7 +61,6 @@

    let x0 = 50, y0 = 220;

    // Trục X (Đỏ) - Nằm ngang sang phải
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
@@ -71,7 +69,6 @@
    ctx.stroke();
    ctx.fillText("X", x0 + 55, y0 + 4);

    // Trục Y (Xanh dương) - Nghiêng 45 độ sang phải
    ctx.strokeStyle = "#2980b9";
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
@@ -80,7 +77,6 @@
    ctx.stroke();
    ctx.fillText("Y", x0 + 40, y0 - 38);

    // Trục Z (Xanh lá) - Thẳng đứng lên trên
    ctx.strokeStyle = "#27ae60";
    ctx.fillStyle = "#27ae60";
    ctx.beginPath();
@@ -105,23 +101,19 @@
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
@@ -131,7 +123,6 @@
    ctx.stroke();
    ctx.fill();

    // 2. Vẽ 4 cạnh dọc thẳng đứng nối đáy và đỉnh
    let bEdges = [b0, b1, b2, b3];
    let tEdges = [t0, t1, t2, t3];
    for (let i = 0; i < 4; i++) {
@@ -141,7 +132,6 @@
        ctx.stroke();
    }

    // 3. Vẽ mặt phẳng đỉnh
    ctx.beginPath();
    ctx.moveTo(t0.x, t0.y);
    ctx.lineTo(t1.x, t1.y);
@@ -151,7 +141,6 @@
    ctx.stroke();
    ctx.fill();

    // 4. Hiển thị thông số kích thước (L, W, H)
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px Segoe UI";

@@ -180,7 +169,6 @@
    let startMsg = "Xin chào, tôi có thể giúp gì cho bạn";
    log("🤖 " + startMsg);

    // Phát lời chào trước, khi nói xong mới bắt đầu bật Micro để không bị thu nhiễu
    window.speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(startMsg);
    u.lang = "vi-VN";
@@ -190,7 +178,7 @@
        log("🔴 <i>Đang nghe...</i>");
        let r = new SR();
        r.lang = "vi-VN"; 
        r.continuous = true; // Kéo dài thời gian lắng nghe
        r.continuous = true;
        r.interimResults = false;

        r.onresult = e => {
@@ -199,7 +187,6 @@
            processFullVoiceNLP(text);
        };

        // Khi người dùng không nói hoặc xảy ra lỗi thu âm
        r.onerror = () => {
            let errorMsg = "Chưa nhận diện được thông số, vui lòng thử lại!";
            log("🤖 " + errorMsg);
@@ -215,21 +202,18 @@
function processFullVoiceNLP(t) {
    log("👤 " + t);

    // Chuẩn hóa từ ngữ tự nhiên sang định dạng chuẩn
    // Chuẩn hóa văn bản: thay thế các từ phát âm nói sang định dạng ký hiệu chuẩn
    let str = t.toLowerCase()
               .replace(/\b(âm|trừ)\b/g, "-")
               .replace(/\bphẩy\b/g, ",")
               .replace(/\bphẩy\b/g, ".")
               .replace(/\bchấm\b/g, ".");

    let updatedCount = 0;

    // Hàm làm sạch chuỗi số (xử lý số âm, số thập phân -2007,5 hay -2007.5)
    // Trích xuất số chuẩn (Bao gồm cả số âm và số thập phân như -2007.5)
    const cleanNumberString = (numStr) => {
        if (!numStr) return "0";
        numStr = numStr.trim();
        if (/^-?\d+[.,]\d{3}$/.test(numStr)) {
            return numStr.replace(/[.,]/g, '');
        }
        numStr = numStr.trim().replace(/\s+/g, '');
        return numStr.replace(',', '.');
    };

@@ -238,22 +222,21 @@
            let regex = new RegExp(`${kw}(?:\\s+là|\\s+bằng|\\s*[:=])?\\s*(-?\\s*\\d+(?:[.,]\\d+)?)`, "i");
            let match = str.match(regex);
            if (match) {
                let valStr = match[1].replace(/\s+/g, '');
                return cleanNumberString(valStr);
                return cleanNumberString(match[1]);
            }
        }
        return null;
    };

    // 1. Nhận diện Orientation (X, Y, Z)
    if (str.includes("hướng x") || str.includes("trục x") || str.includes("ori x")) { setOri('X'); updatedCount++; }
    else if (str.includes("hướng y") || str.includes("trục y") || str.includes("ori y")) { setOri('Y'); updatedCount++; }
    else if (str.includes("hướng z") || str.includes("trục z") || str.includes("ori z")) { setOri('Z'); updatedCount++; }
    // 1. Nhận diện Orientation (Nhận diện linh hoạt từ ngữ tự nhiên)
    if (/(trục|hướng|ori|trục tọa độ)\s*(theo\s*trục\s*)?x\b/i.test(str)) { setOri('X'); updatedCount++; }
    else if (/(trục|hướng|ori|trục tọa độ)\s*(theo\s*trục\s*)?y\b/i.test(str)) { setOri('Y'); updatedCount++; }
    else if (/(trục|hướng|ori|trục tọa độ)\s*(theo\s*trục\s*)?(z|zét|zed)\b/i.test(str)) { setOri('Z'); updatedCount++; }

    // 2. Nhận diện Position (X, Y, Z)
    let posX = findVal(["vị trí x", "pos x", "tọa độ x", "position x", "x"]);
    let posY = findVal(["vị trí y", "pos y", "tọa độ y", "position y", "y"]);
    let posZ = findVal(["vị trí z", "pos z", "tọa độ z", "position z", "z"]);
    // 2. Nhận diện Position (X, Y, Z - Khắc phục các từ bị nhận diện sai/nhầm âm)
    let posX = findVal(["tọa độ x", "vị trí x", "pos x", "position x", "đồ ít", "tọa độ ít", "tọa độ xy", "x"]);
    let posY = findVal(["tọa độ y", "vị trí y", "pos y", "position y", "y"]);
    let posZ = findVal(["tọa độ zét", "tọa độ zed", "tọa độ z", "vị trí z", "pos z", "position z", "z"]);

    if (posX !== null) { document.getElementById("px").value = posX; updatedCount++; }
    if (posY !== null) { document.getElementById("py").value = posY; updatedCount++; }
@@ -288,7 +271,7 @@
        updatedCount++;
    }

    // 5. Nếu nói chuỗi số tự do (Ví dụ: "-2007.5 1000 500")
    // 5. Nếu nói chuỗi số tự do (Bao gồm số âm và số thập phân)
    if (updatedCount === 0) {
        let rawNums = str.match(/-?\d+([.,]\d+)?/g);
        if (rawNums && rawNums.length >= 3) {
@@ -335,84 +318,83 @@
    let r3 = parseInputValue("r3");
    let r4 = parseInputValue("r4");

    // Xác định chính xác chuỗi ORI theo biến ORI đang được chọn
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
    a.download = "Opening.mac";
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
