const c = document.getElementById("view");
const ctx = c.getContext("2d");

let ORI = "Z";

/* CHỌN HƯỚNG */
function setOri(o) {
    ORI = o;
    document.querySelectorAll(".ori button").forEach(b => b.classList.remove("active"));
    document.getElementById("o" + o.toLowerCase()).classList.add("active");
    draw();
}

/* VẼ MÔ HÌNH */
function draw() {
    c.width = c.offsetWidth;
    c.height = 260;

    let L = +document.getElementById("dx").value || 1;
    let W = +document.getElementById("dy").value || 1;
    let H = +document.getElementById("dz").value || 1;

    ctx.clearRect(0, 0, c.width, c.height);

    let max = Math.max(L, W, H);
    let scale = 120 / max;

    let cx = c.width / 2 - 50;
    let cy = c.height / 2 + 20;

    let l = L * scale;
    let w = W * scale;
    let h = H * scale;

    drawAxis();

    if (ORI === "Z") drawBox(cx, cy, l, w, h);
    if (ORI === "X") drawBox(cx, cy, w, h, l);
    if (ORI === "Y") drawBox(cx, cy, l, h, w);

    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 13px Segoe UI";
    ctx.fillText("L = " + L, cx + l / 2, cy + h + 20);
    ctx.fillText("W = " + W, cx + l + w / 2 + 5, cy - w / 4);
    ctx.fillText("H = " + H, cx - 60, cy + h / 2);
}

/* VẼ HỆ TRỤC TỌA ĐỘ */
function drawAxis() {
    ctx.lineWidth = 2;
    ctx.font = "bold 12px Segoe UI";

    // Trục X (Đỏ)
    ctx.strokeStyle = "#e74c3c";
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(40, 200);
    ctx.lineTo(90, 200);
    ctx.stroke();
    ctx.fillText("X", 95, 204);

    // Trục Y (Xanh lá)
    ctx.strokeStyle = "#2ecc71";
    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.moveTo(40, 200);
    ctx.lineTo(40, 150);
    ctx.stroke();
    ctx.fillText("Y", 36, 142);

    // Trục Z (Xanh dương)
    ctx.strokeStyle = "#3498db";
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.moveTo(40, 200);
    ctx.lineTo(75, 165);
    ctx.stroke();
    ctx.fillText("Z", 80, 162);
}

/* VẼ KHỐI BOX ISOMETRIC */
function drawBox(x, y, l, w, h) {
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;

    ctx.strokeRect(x, y, l, h);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y - w / 2);
    ctx.lineTo(x + l + w, y - w / 2);
    ctx.lineTo(x + l, y);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + l, y);
    ctx.lineTo(x + l + w, y - w / 2);
    ctx.lineTo(x + l + w, y + h - w / 2);
    ctx.lineTo(x + l, y + h);
    ctx.closePath();
    ctx.stroke();
}

/* LƯU NHẬT KÝ CHAT */
function log(t) {
    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div>${t}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* GIỌNG NÓI */
function voice() {
    speak("Xin chào, hãy đọc kích thước dài rộng cao");

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
        return;
    }

    let r = new SR();
    r.lang = "vi-VN";
    r.continuous = false;

    r.onresult = e => {
        let text = e.results[0][0].transcript;
        process(text);
    };

    r.start();
}

/* XỬ LÝ DỮ LIỆU GIỌNG NÓI (HỖ TRỢ CẢ SỐ THẬP PHÂN) */
function process(t) {
    log("👤 " + t);

    // Bắt số nguyên hoặc số thập phân
    let nums = t.match(/\d+([.,]\d+)?/g);

    if (nums && nums.length >= 3) {
        document.getElementById("dx").value = nums[0].replace(',', '.');
        document.getElementById("dy").value = nums[1].replace(',', '.');
        document.getElementById("dz").value = nums[2].replace(',', '.');
        draw();
        speak("Đã cập nhật dữ liệu thành công");
    } else {
        speak("Chưa nhận diện đủ 3 thông số dài rộng cao");
    }
}

/* PHÁT ÂM THANH */
function speak(t) {
    let u = new SpeechSynthesisUtterance(t);
    u.lang = "vi-VN";
    speechSynthesis.speak(u);
}

/* XUẤT FILE MACRO DỰNG HÌNH CHO AVEVA */
function saveFile() {
    let px = document.getElementById("px").value;
    let py = document.getElementById("py").value;
    let pz = document.getElementById("pz").value;

    let dx = document.getElementById("dx").value;
    let dy = document.getElementById("dy").value;
    let dz = document.getElementById("dz").value;

    let r1 = document.getElementById("r1").value;
    let r2 = document.getElementById("r2").value;
    let r3 = document.getElementById("r3").value;
    let r4 = document.getElementById("r4").value;

    let data = `$( Exported 3D Cut Zone Macro for AVEVA $)\n` +
               `NEW EQUIPMENT /CUT_ZONE_${Date.now()}\n` +
               `POSITION X ${px}mm Y ${py}mm Z ${pz}mm\n\n` +
               `NEW EXTRUSION\n` +
               `HEIGHT ${dz}mm\n` +
               `NEW LOOP\n` +
               `VERTEX X 0 Y 0 RADIUS ${r1}mm\n` +
               `VERTEX X ${dx} Y 0 RADIUS ${r2}mm\n` +
               `VERTEX X ${dx} Y ${dy} RADIUS ${r3}mm\n` +
               `VERTEX X 0 Y ${dy} RADIUS ${r4}mm\n`;

    let blob = new Blob([data], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Opening_CutZone.mac";
    a.click();
}

/* RESET FORM */
function reset() {
    document.getElementById("px").value = 0;
    document.getElementById("py").value = 0;
    document.getElementById("pz").value = 0;
    document.getElementById("dx").value = 1000;
    document.getElementById("dy").value = 500;
    document.getElementById("dz").value = 300;
    document.getElementById("r1").value = 150;
    document.getElementById("r2").value = 150;
    document.getElementById("r3").value = 150;
    document.getElementById("r4").value = 150;
    setOri('Z');
}

/* NÚT HELP */
function help() {
    window.open("https://drive.google.com/file/d/14NNDzXSCG63m1yQZb51tZhrZfd5k8KPf/view?usp=sharing");
}

document.querySelectorAll("input").forEach(i => {
    i.addEventListener("input", draw);
});

window.addEventListener("resize", draw);
draw();
